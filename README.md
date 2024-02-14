# discord-chatbot--Oleg-Loza

https://discordjs.guide/#before-you-begin

## 1. Create a new server on discord

    <img width="316" alt="Screenshot 2024-02-13 at 13 49 23" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/3a3acc69-e792-4036-a5f4-96ae0e7837ac">

<br>

## 2. Set up the bot on your server
1. Go to ```https://discord.com/developers/applications/```
2. Create the new app
3. Use OAuth2 --> URL generator and generate a url to invite your app (bot) to your server as a channel member
4. Issue(reset) the token to use it later in your code and enable the bot

    <img width="800" alt="Screenshot 2024-02-06 at 13 57 40" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/e411e957-5d17-4ab4-be26-7522b97f14cd">
    <img width="800" alt="Screenshot 2024-02-06 at 13 05 40" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8fb94b6f-cb26-48ce-b77f-e001f598cc35">
    <img width="800" alt="Screenshot 2024-02-06 at 14 11 42" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/74e9371c-5b95-4f88-b976-051e6d0b3ee2">

<br>

## 2. Set up the project

1. Create the project folder and navigate in there

    ```
    mkdir discord_bot && cd discord_bot
    ```
2. Set up the project:

    ```
    npm init -y
    ```
    ```
    npm install discord.js
    ```
    ```
    npm install -g nodemon
    ```
    ```
    npm install --save-dev eslint
    ```
    
    <img width="800" alt="Screenshot 2024-02-06 at 14 30 23" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/73a677b5-0b23-4ca2-9b00-98b0bddf4177">

    Now your bot is "online" but can't talk yet
    
    <img width="300" alt="Screenshot 2024-02-06 at 14 22 32" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/1bff99b7-ac25-41a7-b2b3-19289b7ea1fd">
    
    <br>

## 3. Returning the test messages

1. Modify the script
    
    **<details markdown=1><summary markdown="span">index.js</summary>**
    
    ```js
    require('dotenv').config();
    const { Client, IntentsBitField, Partials } = require('discord.js');
    
    
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
        Partials.Reaction
      ]
    });
    
    
    client.on('ready', (c) => {
      console.log(`✅ ${c.user.tag} is online.`);
    });
    
    
    client.on('messageCreate', message => {
      console.log(`Received message from ${message.author.tag} in ${message.guild ? `guild ${message.guild.name}` : 'DM'}. Content: ${message.content}`);
      
      if (message.author.bot) return;
      
      if (message.content === 'ping') {
        message.channel.send('Pong!');
      }
      
      if (message.content === 'hello') {
        message.channel.send('Hello!');
      }
    });
    
    
    client.login(process.env.DISCORD_TOKEN);
    ```
    
    </details>

2. Result
    
    <img width="800" alt="Screenshot 2024-02-06 at 16 27 45" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8dced1f8-42be-4471-a783-01c06ec055c1">

## 4. Set up slash commands

1. Create a folder and modules with slash commands and set up export
   
3. Create registercommands.js to register the the slash commands and set up the export

4. Modify the index.js to import and register slash commands each time the server launches:

5. Test the commands:
   
    <img width="750" alt="Screenshot 2024-02-13 at 14 04 46" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/b37606b9-9971-4523-a60a-092cf601a9e9">
    <img width="1000" alt="Screenshot 2024-02-13 at 14 11 01" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8c127616-9214-4a20-818a-4433b805c3d8">

## 4. Set up conversation and requests to OPEN AI API

1. Modify the script

   **<details markdown=1><summary markdown="span">index.js</summary>**
   
    ```js
    const { Client, IntentsBitField, Partials } = require('discord.js');
    const { token, apiKey } = require('../config.json');
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
    
    // Event listener for 'ready' event
    client.once('ready', (c) => {
    	console.log(`✅ ${c.user.tag} is online.`);
    });
    
    // Event listener for 'messageCreate' event
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
    			message.channel.send(`A: ${answer}`);
    		}
    	}
    	catch (error) {
    		handleErrorMessage(message, error);
    	}
    });
    
    // Event listener for "slash" commands
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
    		handleCommandError(interaction, error);
    	}
    });
    
    // Function to make API call to OpenAI GPT-3.5
    async function makeChatGPTApiCall(question, channel) {
    	try {
    		await channel.sendTyping();
    
    		const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
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
    		handleApiError(error);
    	}
    }
    
    function handleErrorMessage(message, error) {
    	console.error('Error processing message:', error);
    	message.channel.send('An error occurred while processing your request.');
    }
    
    function handleCommandError(interaction, error) {
    	console.error('Error executing command:', error);
    	interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
    
    function handleApiError(error) {
    	console.error('Error making API call to OpenAI:', error);
    	throw error;
    }
    
    function delay(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    client.login(token);
    ```
    </details>
    
    <img width="800" alt="Screenshot 2024-02-14 at 16 41 38" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/b447fa89-39b7-47dd-a9a1-c3e5952df159">

<br>

## 5. Deploying to a cloud server to run and be available 24 hours a day

1. Launch the server

   <img width="800" alt="Screenshot 2024-02-14 at 16 45 41" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/0e1e1614-937b-4d7a-b7af-b3080a0c9eaf">

   
3. Clone the repository

   ```
   git clone
   ```
5. Install nodejs and npm

   ```
   apt-get installl node 
   ```
7. Install dependencies

   ```
   npm install discord.js
   npm install axios
   ```
   
9. Instal PM2:
      
   ```sh
   sudo npm install -g pm2
   ```
6. Start PM2

   ```sh
   pm2 start index.js
   ```

7. Confirm

   ```sh
   pm2 list index.js
   ```

<br>

<img width="800" alt="Screenshot 2024-02-12 at 18 01 27" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/d756c837-7d08-49d5-be67-c36610dbac63">

