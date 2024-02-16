# Discord AI Chat-Bot

link at the discord docs: [https://discordjs.guide/#before-you-begin](https://discordjs.guide/#before-you-begin)

## 1. Create a new server on discord

1. Create a new server:

   <img width="316" alt="Screenshot 2024-02-13 at 13 49 23" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/3a3acc69-e792-4036-a5f4-96ae0e7837ac">

   <br>

## 2. Set up the bot on your server
1. Go to ```https://discord.com/developers/applications/```
2. Create the new app
3. Use OAuth2 --> URL generator and generate a url to invite your app (bot) to your server as a channel member
4. Issue(reset) the token to use it later in your code and enable the bot

    <img width="800" alt="Screenshot 2024-02-06 at 13 57 40" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/e411e957-5d17-4ab4-be26-7522b97f14cd"><br><br>
    <img width="800" alt="Screenshot 2024-02-06 at 13 05 40" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8fb94b6f-cb26-48ce-b77f-e001f598cc35"><br><br>
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



> [!IMPORTANT]  
> **3. Create the config.json, place it in your root directory and use config-example.json as a template**
> 
> ```json
> {
>    "token": "<your token>", // you can issue the token for your bot using https://discord.com/developers/ portal
>    "apiKey": "<your APIKey>", // you can issue the token for your bot using https://platform.openai.com portal
>    "guildId": "<your GuildID>", // Discord calls servers as "guilds", so copy-paste your server ID
>    "clientId": "<your Client ID>"  // Client means bot here, so copy-paste your bot ID here
> }
> ```

   <br>
    
4. Launch the app in the monitoring mode:

    ```sh
    nodemon
    ```

5. Now your bot is "online" but can't talk yet
    
    <img width="800" alt="Screenshot 2024-02-06 at 14 30 23" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/73a677b5-0b23-4ca2-9b00-98b0bddf4177"><br><br>
    
    <img width="300" alt="Screenshot 2024-02-06 at 14 22 32" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/1bff99b7-ac25-41a7-b2b3-19289b7ea1fd">
    
    <br>

## 3. Returning the test messages

1. Modify the script
    
    **<details markdown=1><summary markdown="span">index.js</summary>**
    
    ```js
    const { token } = require('../config.json');
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
    
    
    client.login(token);
    ```
    
    </details>

2. Result
    
    <img width="800" alt="Screenshot 2024-02-06 at 16 27 45" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8dced1f8-42be-4471-a783-01c06ec055c1">

## 4. Set up slash commands

1. Create a folder and modules with slash commands and set up the export

    **[https://github.com/fac30/discord-chatbot--Oleg-Loza/tree/main/commands/utility](https://github.com/fac30/discord-chatbot--Oleg-Loza/tree/main/commands/utility)**

   
2. Create registercommands.js to register the the slash commands and set up the export

    **[https://github.com/fac30/discord-chatbot--Oleg-Loza/blob/main/registercommands.js](https://github.com/fac30/discord-chatbot--Oleg-Loza/blob/main/registercommands.js)**

    
4. You will need to copy the server ID and the bot ID. Add them to your config as guildID and clientID
    
    <img width="300" alt="Screenshot 2024-02-16 at 22 23 41" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/7ee78767-9be0-40f0-a28e-866d3d268b5e"> <img width="300" alt="Screenshot 2024-02-16 at 22 17 30" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/bead8752-c392-460d-8f26-77200f19e69b">
    
    ```json
    {
       "token": "<your token>", // you can issue the token for your bot using https://discord.com/developers/ portal
       "apiKey": "<your APIKey>", // you can issue the token for your bot using https://platform.openai.com portal
       "guildId": "<your GuildID>", // Discord calls servers as "guilds", so copy-paste your server ID
       "clientId": "<your Client ID>"  // Client means bot here, so copy-paste your bot ID here
    }
    ```
    
    
3. Modify the index.js to import and register slash commands each time the server launches:

    ```js
    const { commands } = require('../registercommands'); 		// Import the commands collection from the registercommands module

    const commands = new Map(); // Create a Map to store commands
    ```

4. Test the commands:
   
    <img width="750" alt="Screenshot 2024-02-13 at 14 04 46" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/b37606b9-9971-4523-a60a-092cf601a9e9">
    <img width="1000" alt="Screenshot 2024-02-13 at 14 11 01" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/8c127616-9214-4a20-818a-4433b805c3d8">

## 4. Set up the conversation and requests to OPEN AI API

1. Modify the script

    the link at the final script: **[index.js](https://github.com/fac30/discord-chatbot--Oleg-Loza/blob/main/src/index.js)**

2. Result:
    
    <img width="800" alt="Screenshot 2024-02-16 at 17 07 24" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/cc46ca5e-db69-4906-816a-220004ba8bf2">
    <img width="800" alt="Screenshot 2024-02-16 at 17 02 31" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/e9881721-73ad-4d92-adde-f3ed7ad3e167">

<br>

## 5. Deploying to a cloud server and run to be available 24 hours a day

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
