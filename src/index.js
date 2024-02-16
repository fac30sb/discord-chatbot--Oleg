/**
 * A Discord bot that interacts with users and utilizes OpenAI's GPT-3.5 model for conversation.
 * 
 * @module discordBot
 */

// Import required modules
const { token, apiKey } = require('../config.json'); // Import Discord bot token and OpenAI API key from config file
                                                     // Store sensitive data like tokens and keys securely in config.json
                                                     // Make sure not to expose config.json to version control systems
                                                     // Use a template file like config-example.json to create your own config
const { Client, IntentsBitField, Partials } = require('discord.js'); // Import Discord.js client and other necessary classes
const axios = require('axios'); // Import Axios for making HTTP requests
const { commands } = require('../registercommands'); // Import the commands collection from the registercommands module

/**
 * The Discord client instance.
 * @type {Client}
 */
const client = new Client({
    // Define the intents required by the bot
    intents: [
        IntentsBitField.Flags.Guilds,                  // For guild-related events
        IntentsBitField.Flags.GuildMembers,            // For guild member-related events
        IntentsBitField.Flags.GuildMessages,           // For guild message-related events
        IntentsBitField.Flags.MessageContent,          // For message content-related events
        IntentsBitField.Flags.GuildMessageTyping,      // For guild message typing-related events
        IntentsBitField.Flags.DirectMessages,          // For direct message-related events
        IntentsBitField.Flags.DirectMessageReactions,  // For direct message reaction-related events
        IntentsBitField.Flags.DirectMessageTyping,     // For direct message typing-related events
    ],
    // Define the partials required by the bot
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ],
});

/**
 * An array to hold the conversation history.
 * Each entry represents a message exchanged between the user and the bot.
 * By default, the array contains only the standard object needed to make a request to the OPEN API.
 * @type {Object[]}
 */
const conversationHistory = [
	{
		role: 'system',
		content: 'You are a helpful assistant.',
	}
];

/**
 * A marker to address the request to the bot.
 * If used, the bot answers the question; otherwise, the question is processed as a standard one in the group chat.
 */
const askBot = /^bro,?/i;

/**
 * Event listener for the 'ready' event.
 * Logs that the bot is online when it successfully connects to Discord.
 * @listens Client#ready
 * @param {Client} c The client instance.
 */
client.once('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
});

/**
 * Event listener for the 'messageCreate' event.
 * Handles incoming messages from users.
 * Responds to specific queries and interacts with OpenAI's GPT-3.5 model.
 * @listens Client#messageCreate
 * @param {Message} message The received message.
 */
client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Define regular expressions to match specific user queries
    const whatsYourName = /bro,? what('?s| is) your name\??/i;
    const areYouBot = /bro,? are (you|u) a? bot\??/i;

    try {
        // Update conversation history with the current message
        conversationHistory.push({
            role: 'user',
            content: message.content,
        });

        // Respond to specific user queries:
        // Name
        if (whatsYourName.test(message.content)) {
            message.channel.send('My friends call me Bro!');
			conversationHistory.push({
				role: 'system',
				content: 'My friends call me Bro!',
			});
        }
        // Nature
        else if (areYouBot.test(message.content)) {
            message.channel.send('Yes, I am a bot!');
			conversationHistory.push({
				role: 'system',
				content: 'Yes, I am a bot!',
			});
        }
        else if (askBot.test(message.content)) {
            const question = message.content.slice('bro'.length).trim();
            if (!question) {
                return message.channel.send('Please provide a question.');
            }

            // Make API call to OpenAI GPT-3.5
            const answer = await makeChatGPTApiCall(question, message.channel);

            // Send answer to Discord channel
            message.channel.send(`A: ${answer}`);
        }
    }
    catch (error) {
        handleErrorMessage(message, error);
    }
});

/**
 * Event listener for "slash" commands.
 * Executes registered slash commands and handles errors gracefully.
 * @listens Client#interactionCreate
 * @param {Interaction} interaction The interaction instance.
 */
client.on('interactionCreate', async interaction => {
    // Ignore interactions that are not commands
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const command = commands.get(commandName);

    if (!command) return;

    try {
        // Display typing indicator and delay to simulate processing
        await Promise.all([
            interaction.channel.sendTyping(),
            delay(2000), // Delay for 2 seconds
        ]);
        // Execute the command
        await command.execute(interaction);
    }
    catch (error) {
        handleCommandError(interaction, error);
    }
});

/**
 * Makes an API call to OpenAI GPT-3.5 to get a response to the provided question.
 * @param {string} question The question asked by the user.
 * @param {TextChannel} channel The Discord channel to send the response to.
 * @returns {Promise<string>} A Promise that resolves to the response generated by GPT-3.5.
 */
 async function makeChatGPTApiCall(question, channel) {
    try {
        await channel.sendTyping();

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const response = await axios.post(apiUrl, {
            messages: conversationHistory,
            model: 'gpt-3.5-turbo',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        // Extract the generated answer from the API response
        const answer = response.data.choices[0].message.content;

        // Update conversation history with the current question and answer
        conversationHistory.push({
            role: 'system',
            content: answer,
        });

		console.log(conversationHistory);

        return answer;
    }
    catch (error) {
        handleApiError(error);
    }
}


/**
 * Handles errors that occur during message processing.
 * Logs the error and notifies the user about the error.
 * @param {Message} message The message object.
 * @param {Error} error The error object.
 */
function handleErrorMessage(message, error) {
    console.error('Error processing message:', error);
    message.channel.send('An error occurred while processing your request.');
}

/**
 * Handles errors that occur during command execution.
 * Logs the error and sends an ephemeral message to the user about the error.
 * @param {Interaction} interaction The interaction object.
 * @param {Error} error The error object.
 */
function handleCommandError(interaction, error) {
    console.error('Error executing command:', error);
    interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
}

/**
 * Handles errors that occur during API calls to OpenAI.
 * Logs the error and throws the error for further handling.
 * @param {Error} error The error object.
 */
function handleApiError(error) {
    console.error('Error making API call to OpenAI:', error);
    throw error;
}

/**
 * Delays execution by the specified number of milliseconds.
 * @param {number} ms The number of milliseconds to delay.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logs the bot in using the provided token.
 */
client.login(token);
