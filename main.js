/* eslint-disable no-case-declarations */
/* eslint-disable indent */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;;

// Discord.JS
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

// Various imports
const fn = require('./modules/functions.js');
const strings = require('./data/strings.json');
const debugMode = process.env.DEBUG;
const statusChannelId = process.env.STATUSCHANNELID

client.once('ready', () => {
	fn.collectionBuilders.slashCommands(client);
	console.log('Ready!');
	// client.channels.fetch(statusChannelId).then(channel => {
	// 	channel.send(`${new Date().toISOString()} -- Ready`).catch(e => console.error(e));
	// });
});

// slash-commands
client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const { commandName } = interaction;

		if (client.slashCommands.has(commandName)) {
			client.slashCommands.get(commandName).execute(interaction).catch(e => console.error(e));
		} else {
			interaction.reply('Sorry, I don\'t have access to that command.').catch(e => console.error(e));
			console.error('Slash command attempted to run but not found: /' + commandName);
		}
	}
});

process.on('uncaughtException', err => {
	console.error(err);
});

client.login(token);