const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jenny')
		.setDescription('Jenny?'),
	async execute(interaction) {
		interaction.reply('867-5309');
	},
};