const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dalle')
		.setDescription('Generate an image with DALL-e')
		.addStringOption(o =>
			o.setName("prompt")
			 .setDescription("Prompt to send to DALL-e")
			 .setRequired(true)
		),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			const userPrompt = interaction.options.getString("prompt");
			const response = await fn.openAI.imagePrompt(userPrompt);
			await interaction.editReply(`${response}`);
		} catch (err) {
			const errorId = fn.generateErrorId();
			console.error(`${errorId}: ${err}`);
			await interaction.editReply(`An error has occured. Error ID: ${errorId}\n${err}`);
		}
	},
};