const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const { emoji } = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savestrain')
		.setDescription('Store a new Strain in the database!')
		.addStringOption(option =>
			option.setName('strain-name')
				.setDescription('What is the phrase?')
				.setRequired(true)),
	async execute(interaction) {
		fn.upload.joint(interaction.options.getString('joint-content'), interaction.client);
		interaction.reply({ content: `The joint has been rolled${emoji.joint}`, ephemeral: true });
	},
};