const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			await interaction.reply('Pong!');
		}
		catch (error) {
			console.error('Error executing command:', error);
			await interaction.reply('An error occurred while executing this command.');
		}
	},
};
