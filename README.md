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

## 2. Set up VS Code

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

<br>

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

1. Create a module with slash commands and set up export:

2. Modify the index.js to import and register slash commands each time the server launches:

3. Test the commands:
   
<img width="750" alt="Screenshot 2024-02-13 at 14 04 46" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/b37606b9-9971-4523-a60a-092cf601a9e9">

## 4. Connecting to OPEN AI API

1. Modify the script
   
    ```yml
    ```
    
    <img width="800" alt="Screenshot 2024-02-06 at 20 58 41" src="https://github.com/fac30/discord-chatbot--Oleg-Loza/assets/113034133/dc0bd4bb-4b0c-469c-a9ac-9377b06d3ae4">

<br>

## 5. Deploying to a cloud server to run and be available 24 hours a day

1. Launch the server
2. Clone the repository
3. Install nodejs and npm
4. Install dependencies
5. Instal PM2:
      
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

