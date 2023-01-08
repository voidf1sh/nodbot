const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('strain')
		.setDescription('Look up information about a cannabis strain.')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('Strain Name')
				.setRequired(true)
				.setAutocomplete(true)),
	async execute(interaction) {
		fn.download.strain(interaction.options.getString('name'), interaction);
	},
};