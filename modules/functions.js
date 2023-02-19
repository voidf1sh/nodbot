// dotenv for importing environment variables
const dotenv = require('dotenv');
const fs = require('fs');
// Configure Environment Variables
dotenv.config();

// Discord.js
const Discord = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = Discord;

// Various imports from other files
const debugMode = process.env.DEBUG;
const config = require('../data/config.json');
const strings = require('../data/strings.json');
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));

const functions = {
	// Functions for managing and creating Collections
	collectionBuilders: {
		// Create the collection of slash commands
		slashCommands(client) {
			if (!client.slashCommands) client.slashCommands = new Discord.Collection();
			client.slashCommands.clear();
			for (const file of slashCommandFiles) {
				const slashCommand = require(`../slash-commands/${file}`);
				if (slashCommand.data != undefined) {
					client.slashCommands.set(slashCommand.data.name, slashCommand);
				}
			}
			if (debugMode) console.log('Slash Commands Collection Built');
		}
	},
	builders: {
		actionRows: {
			example() {
				// Create the button to go in the Action Row
				const exampleButton = this.buttons.exampleButton();
				// Create the Action Row with the Button in it, to be sent with the Embed
				return new ActionRowBuilder()
					.addComponents(exampleButton);
			},
			buttons: {
				exampleButton() {
					return new ButtonBuilder()
						.setCustomId('id')
						.setLabel('Label')
						.setStyle(ButtonStyle.Primary);
				}
			}
		},
		embeds: {
			help(private) {
				const embed = new EmbedBuilder()
					.setColor(strings.embeds.color)
					.setTitle(strings.help.title)
					.setDescription(strings.help.content)
					.setFooter({ text: strings.help.footer });
				return { embeds: [embed] };
			},
			error(content) {
				const embed = new EmbedBuilder()
					.setColor(strings.error.color)
					.setTitle(strings.error.title)
					.setDescription(content)
					.setFooter({ text: strings.embeds.footer });
				return { embeds: [embed], ephemeral: true };
			},
			info(content) {
				const embed = new EmbedBuilder()
					.setColor(strings.embeds.infoColor)
					.setTitle(strings.embeds.infoTitle)
					.setDescription(content)
					.setFooter({ text: strings.embeds.footer });
				return { embeds: [embed], ephemeral: true };
			}
		}
	}
};

module.exports = functions;