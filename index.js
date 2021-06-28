/* eslint-disable brace-style */
// Variable Assignment
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.gifs = new Discord.Collection();
const debug = true;
// const config = require('./config.json');
const { prefix } = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const gifFiles = fs.readdirSync('./gifs').filter(file => file.endsWith('.js'));
// const owner = process.env.ownerID;
const giphy = require('giphy-api')(process.env.giphyAPIKey);

function getCommandFiles() {
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
	}
	if (debug) console.log(client.commands);
}

function getGifFiles() {
	for (const file of gifFiles) {
		const gif = require(`./gifs/${file}`);
		client.gifs.set(gif.name, gif);
	}
	if (debug) console.log(client.gifs);
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
	client.user.setActivity('Nod Simulator 2021', { type: 'PLAYING' }).then().catch(console.error);
	getCommandFiles();
	getGifFiles();
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const ext = extCheck(message.content);
	if (debug) console.log(ext);
	if ((!message.content.startsWith(prefix) && ext == false) || message.author.bot) return;

	if (message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		if (debug) console.log(args);
		if (!client.commands.has(command)) return;

		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.channel.send('There was an error trying to execute that command.');
		}
	}

	if (ext == 'gif') {
		const query = message.content.slice(0, -4);
		if (debug) console.log(query);

		if (!client.gifs.has(query)) {
			giphy.search(query, (err, res) => {
				if (res.data[0] != undefined) {
					message.channel.send(res.data[0].embed_url).then().catch(console.error);
				} else {
					message.channel.send('I was unable to find a gif of ' + query);
				}
				if (err) console.error(err);
			});
		} else {
			message.channel.send(client.gifs.get(query).embed_url);
		}
	}
});