const Discord = require('discord.js');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const gifFiles = fs.readdirSync('./gifs').filter(file => file.endsWith('.js'));
const pastaFiles = fs.readdirSync('./pastas').filter(file => file.endsWith('.js'));
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
	getPastaFiles(client) {
		client.pastas = new Discord.Collection();
		for (const file of pastaFiles) {
			const pasta = require(`./pastas/${file}`);
			client.pastas.set(pasta.name, pasta);
		}
		if (debug) console.log(client.pastas);
	},
	getFileInfo(content) {
		const finalPeriod = content.search(/\.(?:.(?!\\))+$/gim);
		if (finalPeriod < 0) return false;
		const extension = content.slice(finalPeriod).replace('.','').toLowerCase();
		const filename = content.slice(0,finalPeriod).toLowerCase();
		const file = {
			'name': filename,
			'extension': extension
		};
		console.log(finalPeriod, file);
		return file;
	},
	extIsValid(extension) {
		switch (extension) {
		case 'gif':
			return true;
		case 'jpg':
			return false;
		case 'pasta':
			return true;
		case 'admin':
			return true;
		case 'spongebob':
			return true;
		default:
			return false;
		}
	}
}