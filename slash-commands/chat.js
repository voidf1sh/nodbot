const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Send a message to ChatGPT')
		.addStringOption(o =>
			o.setName("prompt")
			 .setDescription("Prompt to send to ChatGPT")
			 .setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const userPrompt = interaction.options.getString("prompt");
		const response = await fn.openAI.chatPrompt(userPrompt).catch(e => console.error(e));
		const gptEmbed = fn.embeds.gpt(interaction.user, userPrompt, response);
		await interaction.editReply(gptEmbed);
	},
};