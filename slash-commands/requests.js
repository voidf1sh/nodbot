const { SlashCommandBuilder } = require('@discordjs/builders');
const { config } = require('dotenv');
const fn = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('requests')
		.setDescription('Get a list of Active requests from the database')
		.addStringOption(option =>
			option
				.setName('page')
				.setDescription('Page Number')
				.setRequired(true)),
	async execute(interaction) {
		const pageNum = interaction.options.getString('page');
		const commandData = {
			author: interaction.user.tag,
			command: interaction.commandName,
			requests: [],
		};
		const requestsMap = interaction.client.requests.map(e => {
			return {
				id: e.id,
				author: e.author,
				request: e.request,
			};
		});
		for (let i = ( 10 * ( pageNum - 1 ) ); i < ( 10 * pageNum ); i++) {
			if (requestsMap[i] != undefined) {
				commandData.requests.push({
					id: requestsMap[i].id,
					author: requestsMap[i].author,
					request: requestsMap[i].request,
				});
			}
		}
		interaction.reply(fn.embeds.requests(commandData));
	},
};