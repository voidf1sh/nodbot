const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const strings = require('../strings.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save')
		.setDescription('Save content to Nodbot\'s database.')
		.addSubcommandGroup(sc =>
			sc.setName('gif')
			.setDescription('Save a gif (or other embeddable link)')
			.addSubcommand(sc =>
				sc.setName('search')
				.setDescription('Search Tenor for gifs')
				.addStringOption(o =>
					o.setName('query')
					.setDescription('Search Query')
					.setRequired(true)
				)
			)
			.addSubcommand(sc =>
				sc.setName('enterurl')
				.setDescription('Save a link to some embeddable media')
				.addStringOption(o =>
					o.setName('url')
					.setDescription('The link to the media')
					.setRequired(true)
				)
			)
		)
		.addSubcommand(sc =>
			sc.setName('joint')
			.setDescription('Save a phrase to the .joint database')
			.addStringOption(o =>
				o.setName('content')
				.setDescription('What do you want to save?')
				.setRequired(true)
			)
		)
		.addSubcommand(sc =>
			sc.setName('md')
			.setDescription('Save a phrase to the .md database')
			.addStringOption(o =>
				o.setName('content')
				.setDescription('What do you want to save?')
				.setRequired(true)
			)
		)
		.addSubcommand(sc =>
			sc.setName('pasta')
			.setDescription('Save a copypasta to the database')
			.addStringOption(o =>
				o.setName('name')
				.setDescription('What is the name of the copypasta? (don\'t include .pasta)')
				.setRequired(true)
			)
			.addStringOption(o =>
				o.setName('content')
				.setDescription('What\'s the copypasta?')
				.setRequired(true)
			)
		)
		.addSubcommand(sc =>
			sc.setName('strain')
			.setDescription('Save a strain\'s information to the database')
			.addStringOption(option =>
				option.setName('name')
				.setDescription('Name of the Strain')
				.setRequired(true))
			.addStringOption(option =>
				option.setName('type')
				.setDescription('Indica/Sativa/Hybrid')
				.setRequired(true)
				.addChoices(
					{ name: "Indica", value: "Indica" },
					{ name: "Hybrid", value: "Hybrid" },
					{ name: "Sativa", value: "Sativa" }
				))
			.addStringOption(option =>
				option.setName('effects')
				.setDescription('The effects given by the strain')
				.setRequired(false))
			.addStringOption(option =>
				option.setName('flavor')
				.setDescription('Flavor notes')
				.setRequired(false))
			.addStringOption(option =>
				option.setName('rating')
				.setDescription('Number of stars')
				.setRequired(false))
			.addStringOption(option =>
				option.setName('description')
				.setDescription('Description of the strain')
				.setRequired(false)),
		),
	async execute(interaction) {
		
	},
};