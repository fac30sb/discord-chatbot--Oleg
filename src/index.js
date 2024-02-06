require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
  ],
});

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});


client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === 'ping') {
    message.channel.send('Pong!');
  }
  if (message.content === 'hello') {
    message.channel.send('Hello!');
  }
});

client.login(process.env.DISCORD_TOKEN);