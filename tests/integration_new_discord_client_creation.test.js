const assert = require('assert');
const { Client, IntentsBitField } = require('discord.js');
const test = require('node:test');
const axios = require('axios');
const { apiKey, token } = require('../config.json'); 

/**
 * Test function to verify Discord.js integration by creating a new Discord client.
 */
test("Discord client creation should result in creating the object", () => {
  const client = new Client({
    // Define the intents required by the bot
    intents: [
      IntentsBitField.Flags.Guilds,
    ]
  });

  assert.strictEqual(typeof client, 'object');
});

/**
* Test function to ensure that the OpenAI library is correctly integrated.
*/
test("OpenAI API integration should return a valid response", async () => {
  try {
    // Make a simple request to the OpenAI API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [{ role: 'system', content: 'Once upon a time' }],
      model: 'gpt-3.5-turbo',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // Assert that the response status is successful
    assert.strictEqual(response.status, 200);
    
    // Assert that the response contains data
    assert.ok(response.data && response.data.choices && response.data.choices.length > 0);

    console.log('OpenAI API integration test passed.');
  } catch (error) {
    // If there's an error, fail the test and log the error
    console.error('OpenAI API integration test failed:', error);
    assert.fail('OpenAI API integration test failed');
  }
});

test("Bot should securely load API keys from the config.json file", () => {
  try {
    // Check if the apiKey is defined and not empty without revealing its value
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key not found or empty in config.json');
    }

    // Add more checks if needed based on your config.json file structure

    console.log('Bot securely loads API keys from the config.json file.');
  } catch (error) {
    // If there's an error, fail the test and log the error
    console.error('Error while checking config.json file:', error);
    assert.fail('Error while checking config.json file');
  }
});

test("Bot initialization and login to Discord should succeed", async () => {
  try {
    // Create a new Discord client instance
    const client = new Client({
      intents: [IntentsBitField.Flags.Guilds],
    });

    // Log in the bot using the provided token
    await client.login(token);

    // Check if the bot is logged in by verifying its presence in the guilds cache
    assert.ok(client.guilds.cache.size > 0, "Bot is not logged in or failed to initialize.");

    await client.destroy();

    console.log("Bot initialization and login to Discord succeeded.");
  } catch (error) {
    // If there's an error, fail the test and log the error
    console.error("Bot initialization and login to Discord failed:", error);
    assert.fail("Bot initialization and login to Discord failed");
  }
});

 
