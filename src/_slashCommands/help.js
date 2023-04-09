const { SlashCommandBuilder } = require('discord.js');
const fn = require('../modules/functions.js');
const strings = require('../data/strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get some help using the bot")
		.addBooleanOption(o =>
			o.setName("private")
			.setDescription("Should the reply be visible only to you?")
			.setRequired(false)
		),
	id: "", // The command ID, used to generate clickable commands
	about: "Get some help using the bot", // A description of the command to be used with /commands
	async execute(interaction) {
		let private = interaction.options.getBoolean('private');
		if (private == undefined) {
			private = true;
		}
		await interaction.deferReply({ ephemeral: private }).catch(e => console.error(e));
		try {
			await interaction.editReply(fn.builders.embeds.help()).catch(e => console.error(e));
		} catch(err) {
			// In case of error, log it and let the user know something went wrong
			console.error(err);
			await interaction.editReply(strings.errors.generalCommand).catch(e => console.error(e));
		}
	},
};