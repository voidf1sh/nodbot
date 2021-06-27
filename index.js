/* eslint-disable brace-style */
// Variable Assignment
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const debug = true;
const config = require('./config.json');
const { prefix, serverID } = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// const owner = process.env.ownerID;

function getCommandFiles() {
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
	if (debug) console.log(client.commands);
}

function extCheck(content) {
	const lastFour = content.slice(-4);
	switch (lastFour) {
	case '.gif':
		return 'gif';
	case '.jpg':
		return 'jpg';
	default:
		return false;
	}
}

client.once('ready', () => {
	console.log('Ready');
	client.guilds.fetch(serverID)
		.then(guild => client.user.setActivity('Nod Simulator 2021', {type: "PLAYING"}))
		.catch(console.error);
	getCommandFiles();
});

client.login(process.env.TOKEN);

client.on('message', message => {
	if (debug) console.log(extCheck(message.content));
	if (!message.content.startsWith(prefix) || message.author.bot || !extCheck(message.content)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command.');
	}
});