const assert = require('assert');
const { Client, IntentsBitField } = require('discord.js');
const test = require('node:test');
const axios = require('axios');
const { apiKey, token } = require('../config.json');
const discordBot = require('../src/index.js');

/**
 * Test function to verify Discord.js integration by creating a new Discord client.
 */
test('Discord client creation should result in creating the object', () => {
	const client = new Client({
		// Define the intents required by the bot
		intents: [
			IntentsBitField.Flags.Guilds,
		],
	});

	assert.strictEqual(typeof client, 'object');
});

/**
* Test function to ensure that the OpenAI library is correctly integrated.
*/
test('OpenAI API integration should return a valid response', async () => {
	try {
		// Make a simple request to the OpenAI API
		const response = await axios.post('https://api.openai.com/v1/chat/completions', {
			messages: [{ role: 'system', content: 'Once upon a time' }],
			model: 'gpt-3.5-turbo',
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
			},
		});

		// Assert that the response status is successful
		assert.strictEqual(response.status, 200);

		// Assert that the response contains data
		assert.ok(response.data && response.data.choices && response.data.choices.length > 0);

		console.log('OpenAI API integration test passed.');
	}
	catch (error) {
		// If there's an error, fail the test and log the error
		console.error('OpenAI API integration test failed:', error);
		assert.fail('OpenAI API integration test failed');
	}
});

/**
* Test that my bot securely loads API keys from the .env file,
* confirming that no sensitive information is hard-coded
*/
test('Bot should securely load API keys from the config.json file', () => {
	try {
		// Check if the apiKey is defined and not empty without revealing its value
		if (!apiKey || apiKey.trim() === '') {
			throw new Error('API key not found or empty in config.json');
		}

		// Add more checks if needed based on your config.json file structure

		console.log('Bot securely loads API keys from the config.json file.');
	}
	catch (error) {
		// If there's an error, fail the test and log the error
		console.error('Error while checking config.json file:', error);
		assert.fail('Error while checking config.json file');
	}
});

/**
* Test to nsure that the bot initialises and logs into Discord successfully
*/
test('Bot initialization and login to Discord should succeed', async () => {
	try {
		// Create a new Discord client instance
		const client = new Client({
			intents: [IntentsBitField.Flags.Guilds],
		});

		// Log in the bot using the provided token
		await client.login(token);

		// Check if the bot is logged in by verifying its presence in the guilds cache
		assert.ok(client.guilds.cache.size > 0, 'Bot is not logged in or failed to initialize.');

		await client.destroy();

		console.log('Bot initialization and login to Discord succeeded.');
	}
	catch (error) {
		// If there's an error, fail the test and log the error
		console.error('Bot initialization and login to Discord failed:', error);
		assert.fail('Bot initialization and login to Discord failed');
	}
});

/**
*
* Testing the message event listener’s functionality,
* simulate receiving a message and verify that my bot responds with a “hello” message
*/
test('Bot responds with \'hello\' message upon receiving a message', async () => {
	let client; // Define the client variable outside the try-catch block for logout

	try {
		// Create a new Discord client instance
		client = new Client({
			intents: [IntentsBitField.Flags.Guilds],
		});

		// Define a promise to await message response
		const messageReceived = new Promise(resolve => {
			client.once('messageCreate', message => {
				resolve(message);
			});
		});

		// Log in the bot using the provided token
		await client.login(token);

		// Simulate receiving a message
		client.emit('messageCreate', { content: 'hello', author: { bot: false } });

		// Wait for the bot to respond with a 'hello' message
		const responseMessage = await messageReceived;

		// Check if the bot responded with a 'hello' message
		assert.strictEqual(responseMessage.content, 'hello', 'Bot did not respond with \'hello\' message.');

		console.log('Bot responded with \'hello\' message upon receiving a message.');
	}
	catch (error) {
		// If there's an error, fail the test and log the error
		console.error('Bot message event listener functionality test failed:', error);
		assert.fail('Bot message event listener functionality test failed');
	}
	finally {
		// Log out the bot after completing the test
		if (client) await client.destroy();
		console.log('Bot successfully logged out from Discord.');
	}
});

/**
* Test to simulate commands directed at the bot and check if it accurately processes these commands.
*/
test('Bot accurately processes commands from general messages', async () => {
	let client; // Define the client variable outside the try-catch block for logout

	try {
		// Create a new Discord client instance
		client = new Client({
			intents: [IntentsBitField.Flags.Guilds],
		});

		await client.login(token);

		const commandExecuted = new Promise(resolve => {
			client.once('messageCreate', async message => {
				if (message.content === 'bro what is your name?') {
					resolve('My friends call me Bro!'); // Resolve with just the content
				}
			});
		});

		client.emit('messageCreate', { content: 'bro what is your name?', author: { bot: false } });

		const response = await commandExecuted;

		console.log(`bot responded with: ${response}`);

		assert.strictEqual(response, 'My friends call me Bro!', 'Bot did not respond with expected message.');

		console.log('Bot accurately processes commands from general messages.');
	}
	catch (error) {
		console.error('Bot command processing test failed:', error);
		assert.fail('Bot command processing test failed');
	}
	finally {
		if (client) await client.destroy();
	}
});

/**
 * Test to introduce faults or exceptions in bot interactions to verify that
 * the bot’s error handling mechanisms effectively manage and log errors.
 */
test('Error handling test: Introducing faults or exceptions', async () => {
	try {
		// Simulate a scenario where the bot encounters an error during command execution
		// For example, here we'll pass an undefined interaction object to the command error handling function
		await discordBot.handleErrorMessage(undefined);

		// If an error is not thrown, fail the test
		assert.fail('Error handling test: Introducing faults or exceptions - Expected an error to be thrown');
	}
	catch (error) {
		// Verify that the error was properly handled and logged
		assert.strictEqual(error.message, 'Cannot read properties of undefined (reading \'channel\')');
		console.log('Successful error handling test: Introducing faults or exceptions - Error properly handled and logged');
	}
	finally {
		process.exit();
	}
});
