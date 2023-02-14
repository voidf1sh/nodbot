const { SlashCommandBuilder } = require('discord.js');
const fn = require('../modules/functions.js');
const strings = require('../data/strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("commands")
		.setDescription("View all of the bot's commands")
		.addBooleanOption(o =>
			o.setName("private")
			.setDescription("Should the reply be visible only to you?")
			.setRequired(false)
		),
	id: "", // The command ID, used to generate clickable commands
	about: "[meta] View all of the bot's commands", // A description of the command to be used with /commands
	async execute(interaction) {
		let private = interaction.options.getBoolean('private');
		if (private == undefined) {
			private = true;
		}
		// Defer the reply so we have time to do things
		await interaction.deferReply({ ephemeral: private }).catch(e => console.error(e));
		try {
			// Code here...
			let commandsParts = ["These are all of the bot's commands, and some information about them:"];
			interaction.client.slashCommands.forEach(slashCommand => {
				commandsParts.push(`</${slashCommand.data.name}:${(slashCommand.id == "" ? "0" : slashCommand.id)}> - ${slashCommand.about}`);
			});
			let commandsString = commandsParts.join("\n");
			await interaction.editReply(fn.builders.embeds.info(commandsString)).catch(e => console.error(e));
		} catch(err) {
			// In case of error, log it and let the user know something went wrong
			console.error(err);
			await interaction.editReply(strings.errors.generalCommand).catch(e => console.error(e));
		}
	},
};