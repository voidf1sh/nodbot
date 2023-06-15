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
		await interaction.editReply(fn.embeds.generatingResponse());
		const userPrompt = interaction.options.getString("prompt");
		const response = await fn.openAI.chatPrompt(userPrompt).catch(e => console.error(e));
		const responseText = response.choices[0].text.slice(2);
		const usage = {
			tokens: response.usage.total_tokens,
			usdc: response.usage.total_tokens * ( 0.2 / 1000 ) // 0.2¢ per 1000 tokens or 0.0002¢ per token.
		};
		const gptEmbed = fn.embeds.gpt(userPrompt, responseText, usage);
		await interaction.editReply(gptEmbed);
		fn.upload.openai(interaction.user.id, userPrompt, "gpt-3.5-turbo", usage.tokens, usage.usdc);
	},
};