// UNDER DEVELOPMENT
// This *should* create the tables required to use Nodbot, 
//  assuming you have a database set up with proper permissions.

const { SlashCommandBuilder } = require('@discordjs/builders');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Create the tables required to use Nodbot'),
	async execute(interaction) {
		await interaction.reply({ content: fn.upload.setup(), ephemeral: true });
	},
};