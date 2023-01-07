const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');
const { emoji } = require('../strings.json');

// Strain Name | Type | Effects | Flavor | Rating | Description

module.exports = {
	data: new SlashCommandBuilder()
		.setName('savestrain')
		.setDescription('Store a new Strain in the database!')
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
	async execute(interaction) {
		fn.upload.strain(interaction).then(res => {
			interaction.reply({
				content: `The strain information has been saved. (${interaction.options.getString('name')})`,
				ephemeral: true
			});
		}).catch(err => {
			console.log(`E: ${err}`);
			interaction.reply({
				content: 'There was a problem saving the strain.',
				ephemeral: true
			});
		});
	},
};