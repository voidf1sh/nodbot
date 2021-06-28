/* eslint-disable brace-style */
// Variable Assignment
const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();

const debug = true;
// const config = require('./config.json');
const { prefix } = require('./config.json');

// const  owner = process.env.ownerID;
const giphy = require('giphy-api')(process.env.giphyAPIKey);
const functions = require('./functions.js');


client.once('ready', () => {
	console.log('Ready');
	client.user.setActivity('Nod Simulator 2021', { type: 'PLAYING' }).then().catch(console.error);
	functions.getCommandFiles(client);
	functions.getGifFiles(client);
	functions.getPastaFiles(client);
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const args = message.content.trim().split(/ +/);
	const extension = functions.getExtension(args);
	if ((!message.content.startsWith(prefix) && extension != undefined) || message.author.bot) return;

	if (message.content.startsWith(prefix)) {
		const command = args.shift().toLowerCase().slice(prefix.length);

		if (debug) console.log(args);
		if (!client.commands.has(command)) return;

		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.channel.send('There was an error trying to execute that command.');
			message.guild.owner
		}
	}

	const query = message.content.slice(0, -4);
	switch (extension) {
	case '.gif':
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
		break;
	case '.pasta':
		const pastaName = args[0].splice(args[0].search(/\.(?:.(?!\\))+$/gim))
		if (debug) console.log(query);

		if (!client.pastas.has(query)) {
			message.reply('Sorry I couldn\'t find that gif.');
		} else {
			message.channel.send(client.pastas.get(query).content);
		}
		break;
	default:
		break;
	}
});