const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
// const { emoji } = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savemd')
		.setDescription('Add medical advice to NodBot\'s Database!')
		.addStringOption(option =>
			option.setName('advice-content')
				.setDescription('What is the advice?')
				.setRequired(true)),
	async execute(interaction) {
		fn.upload.medicalAdvice(interaction.options.getString('advice-content'), interaction.client);
		interaction.reply({ content: `The advice has been saved!`, ephemeral: true });
	},
};