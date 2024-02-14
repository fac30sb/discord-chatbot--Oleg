const { Client, IntentsBitField, Partials } = require('discord.js');
const { token, api_key } = require('../config.json');
const axios = require('axios');
const { commands } = require('../registercommands'); // Import the commands collection


const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageTyping,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.DirectMessageReactions,
		IntentsBitField.Flags.DirectMessageTyping,
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
	],
});

// Define a global array to hold the conversation history
const conversationHistory = [];

client.once('ready', (c) => {
	console.log(`✅ ${c.user.tag} is online.`);
});

// Function to make API call to OpenAI GPT-3.5
async function makeChatGPTApiCall(question, channel) {
    try {
        await channel.sendTyping();

        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const apiKey = api_key;

        // Create the messages array using the existing conversation history
        const messages = conversationHistory.map(entry => ({
            role: 'user',
            content: entry.question,
        }));

        // Add a system message as the first element in the messages array
        messages.unshift({
            role: 'system',
            content: 'You are a helpful assistant.',
        });

        const response = await axios.post(apiUrl, {
            messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
            model: 'gpt-3.5-turbo',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const answer = response.data.choices[0].message.content;

        // Add the current question and answer to the conversation history
        conversationHistory.push({
            role: 'system',
            question: question,
            answer: answer,
        });

        console.log(conversationHistory);

        return answer;
    }
    catch (error) {
        console.error('Error making API call to OpenAI:', error);
        throw error;
    }
}


// conversation
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	const whatsYourName = /bro,? what('?s| is) your name\??/i;
	const areYouBot = /bro,? are (you|u) a? bot\??/i;
	const askBot = /^bro,?/i;

	try {
		// Update conversation history with the current message
		conversationHistory.push({
			role: 'user',
			question: message.content,
		});

		if (whatsYourName.test(message.content)) {
			message.channel.send('My friends call me Bro!');
		}
		else if (areYouBot.test(message.content)) {
			message.channel.send('Yes, I am a bot!');
		}
		else if (askBot.test(message.content)) {
			const question = message.content.slice('bro'.length).trim();
			if (!question) {
				return message.channel.send('Please provide a question.');
			}

			// Make API call to OpenAI GPT-3.5
			const answer = await makeChatGPTApiCall(question, message.channel);

			// Send answer to Discord channel
			message.channel.send(`Q: ${question}\nA: ${answer}`);
		}
	}
	catch (error) {
		console.error('Error processing message:', error);
		message.channel.send('An error occurred while processing your request.');
	}
});


// slash commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const commandName = interaction.commandName;
	const command = commands.get(commandName);

	if (!command) return;

	try {
		await Promise.all([
			interaction.channel.sendTyping(),
			delay(2000), // Delay for 2 seconds
		]);
		await command.execute(interaction);
	}
	catch (error) {
		console.error('Error executing command:', error);
		await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
	}
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

client.login(token);
