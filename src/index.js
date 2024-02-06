require('dotenv').config();
const { Client, IntentsBitField, Partials } = require('discord.js');
const axios = require('axios');

const client = new Client
({
	intents:
  [
  	IntentsBitField.Flags.Guilds,
  	IntentsBitField.Flags.GuildMembers,
  	IntentsBitField.Flags.GuildMessages,
  	IntentsBitField.Flags.MessageContent,
  	IntentsBitField.Flags.GuildMessageTyping,
  	IntentsBitField.Flags.DirectMessages,
  	IntentsBitField.Flags.DirectMessageReactions,
  	IntentsBitField.Flags.DirectMessageTyping,
  ],
	partials:
  [
  	Partials.Message,
  	Partials.Channel,
  	Partials.Reaction,
  ],
});


client.on('ready', (c) => {
	console.log(`✅ ${c.user.tag} is online.`);
});


// Define a global array to hold the conversation history
const conversationHistory = [];

// Function to make API call to OpenAI GPT-3.5
async function makeChatGPTApiCall(question) {
	try {
		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const apiKey = process.env.OPENAI_API_KEY;

		// Create the messages array using the existing conversation history
		const messages = conversationHistory.map(entry => ({
			role: 'system',
			content: 'You are a helpful assistant.',
		}, {
			role: 'user',
			content: entry.question,
		}));

		// Add the current user question to the messages array
		messages.push({ role: 'user', content: question });

		const response = await axios.post(apiUrl, {
			messages: messages, // Use the existing conversation history
			model: 'gpt-3.5-turbo',
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
			},
		});

		return response.data.choices[0].message.content;
	}
	catch (error) {
		console.error('Error making API call to OpenAI:', error);
		throw error;
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	try {
		if (message.content === '!hello') {
			message.channel.send('Hello!');
		}
		else if (message.content.startsWith('!bro')) {
			const question = message.content.slice('!bro'.length).trim();
			if (!question) {
				return message.channel.send('Please provide a question.');
			}

			// Make API call to OpenAI GPT-3.5
			const answer = await makeChatGPTApiCall(question);

			// Update conversation history
			conversationHistory.push({ question, answer });

			// Send answer to Discord channel
			message.channel.send(`Q: ${question}\nA: ${answer}`);
		}
	}
	catch (error) {
		console.error('Error processing message:', error);
		message.channel.send('An error occurred while processing your request.');
	}
});

client.login(process.env.DISCORD_TOKEN);