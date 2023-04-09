const { SlashCommandBuilder } = require('discord.js');
const fn = require('../modules/functions.js');
const strings = require('../data/strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("View lists of saved content")
		.addStringOption(o =>
			o.setName('contenttype')
			.setDescription('What type of content do you want listed?')
			.addChoices([
				"pastas",
				"gifs",
				"joints",
				"mds",
				"strains",
				"suggestions"
			])
			.setRequired(true)
		)
		.addBooleanOption(o =>
			o.setName("private")
			.setDescription("Should the reply be visible only to you?")
			.setRequired(false)
		),
	id: "", // The command ID, used to generate clickable commands
	about: "View lists of saved content, including IDs to edit and delete content.", // A description of the command to be used with /commands
	async execute(interaction) {
		let private = interaction.options.getBoolean('private');
		let contentType = interaction.options.getString('contenttype');
		if (private == undefined) {
			private = true;
		}
		// Defer the reply so we have time to do things
		await interaction.deferReply({ ephemeral: private }).catch(e => console.error(e));
		try {
			// Handle each content type appropriately
			switch (contentType) {
				case "joints":
					
					break;
				case "pastas":
					
					break;
				case "mds":
					
					break;
				case "strains":
					
					break;
				case "gifs":
					
					break;
				case "suggestions":
					
					break;
				default:
					break;
			}
		} catch(err) {
			// In case of error, log it and let the user know something went wrong
			console.error(err);
			await interaction.editReply(strings.errors.generalCommand).catch(e => console.error(e));
		}
	},
};