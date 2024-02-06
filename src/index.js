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