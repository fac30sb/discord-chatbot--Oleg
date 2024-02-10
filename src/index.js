const { Client, IntentsBitField, Partials } = require('discord.js');
const { token, api_key } = require('../config.json');
const axios = require('axios');

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

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
});

// Function to make API call to OpenAI GPT-3.5
async function makeChatGPTApiCall(question, channel) {
    try {
        // Simulate typing
        await channel.sendTyping();

        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const apiKey = api_key;

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

        const answer = response.data.choices[0].message.content;

        return answer;
    } catch (error) {
        console.error('Error making API call to OpenAI:', error);
        throw error;
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

	const whatsyourname = /bro,? what('?s| is) your name\?/i;

    try {
        if (whatsyourname.test(message.content)) {
            message.channel.send('My friends call me Bro!');
		} else if (/bro,? are (you|u) a? bot\?/i.test(message.content)) {
			message.channel.send('Yes, I am a bot!');
        } else if (/^bro,?/i.test(message.content)) {
            const question = message.content.slice('!bro'.length).trim();
            if (!question) {
                return message.channel.send('Please provide a question.');
            }

            // Make API call to OpenAI GPT-3.5
            const answer = await makeChatGPTApiCall(question, message.channel);

            // Send answer to Discord channel
            message.channel.send(`Q: ${question}\nA: ${answer}`);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        message.channel.send('An error occurred while processing your request.');
    }
});

client.login(token);
