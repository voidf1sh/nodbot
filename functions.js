const Discord = require('discord.js');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const gifFiles = fs.readdirSync('./gifs').filter(file => file.endsWith('.js'));
const debug = true;

module.exports = {
	getCommandFiles(client) {
		client.commands = new Discord.Collection();
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
		if (debug) console.log(client.commands);
	},
	getGifFiles(client) {
		client.gifs = new Discord.Collection();
		for (const file of gifFiles) {
			const gif = require(`./gifs/${file}`);
			client.gifs.set(gif.name, gif);
		}
		if (debug) console.log(client.gifs);
	},
	extCheck(content) {
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
}