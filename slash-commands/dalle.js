const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const strings = require("../strings.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dalle')
		.setDescription('Generate an image with DALL-e')
		.addStringOption(o =>
			o.setName("prompt")
			 .setDescription("Prompt to send to DALL-e")
			 .setRequired(true)
		)
		.addStringOption(o =>
			o.setName("size")
			 .setDescription("1024x1024, 512x512, 256x256")
			 .setRequired(false)
			 .addChoices(
				{ name: "1024x1024 (2¢)", value: "1024x1024" },
				{ name: "512x512 (1.8¢)", value: "512x512" },
				{ name: "256x256 (1.6¢)", value: "256x256" }
			 )),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			await interaction.editReply(fn.embeds.generatingResponse());
			const userPrompt = interaction.options.getString("prompt");
			const size = interaction.options.getString("size") ? interaction.options.getString("size") : "512x512";

			const imageUrl = await fn.openAI.imagePrompt(userPrompt, size);
			const dalleEmbed = fn.embeds.dalle(userPrompt, imageUrl, size);
			await interaction.editReply(dalleEmbed);
			fn.upload.openai(interaction.user.id, userPrompt, "dalle", 0, strings.costs.dalle[size]);
		} catch (err) {
			const errorId = fn.generateErrorId();
			console.error(`${errorId}: ${err}`);
			await interaction.editReply(`An error has occured. Error ID: ${errorId}\n${err}`);
		}
	},
};