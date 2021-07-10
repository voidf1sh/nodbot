const Discord = require('discord.js');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const gifFiles = fs.readdirSync('./gifs').filter(file => file.endsWith('.js'));
const pastaFiles = fs.readdirSync('./pastas').filter(file => file.endsWith('.js'));

module.exports = {
	getCommandFiles(client) {
		client.commands = new Discord.Collection();
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
	},
	getGifFiles(client) {
		client.gifs = new Discord.Collection();
		for (const file of gifFiles) {
			const gif = require(`./gifs/${file}`);
			client.gifs.set(gif.name, gif);
		}
	},
	getPastaFiles(client) {
		client.pastas = new Discord.Collection();
		for (const file of pastaFiles) {
			const pasta = require(`./pastas/${file}`);
			client.pastas.set(pasta.name, pasta);
		}
	},
	getFileInfo(content) {
		// const finalPeriod = content.search(/\.(?:.(?!\\))+$/gim);
		const finalPeriod = content.lastIndexOf('.');
		if (finalPeriod < 0) return false;
		const extension = content.slice(finalPeriod).replace('.','').toLowerCase();
		const filename = content.slice(0,finalPeriod).toLowerCase();
		const file = {
			'name': filename,
			'extension': extension
		};
		return file;
	},
	extIsValid(extension) {
		const extensions = require('./config.json').validExtensions;
		return extensions.includes(extension);
	},
	cleanInput(input) {
		return input.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
	},
	createGifEmbed(data) {
		return new Discord.MessageEmbed()
			.setAuthor('NodBot v2 - GIF')
			.setTitle(data.name)
			.setImage(data.embed_url)
			.setTimestamp()
			.setFooter('@' + data.requestor.username + '#' + data.requestor.discriminator);
	}
}