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
	// TODO this will surely break something when trying to use non-filename commands
	const file = functions.getExtension(args);
	// If the message is from a bot, or doesn't have the prefix or a file extension, stop here.
	if ((!message.content.startsWith(prefix) && file[1] == undefined) || message.author.bot) return;

	// If the message starts with the prefix,
	if (message.content.startsWith(prefix)) {
		// Extract the command
		const command = args.shift().toLowerCase().slice(prefix.length);

		if (debug) console.log(args);
		// If the command collection doesn't contain the given command, stop here.
		if (!client.commands.has(command)) return;

		try {
			// Attempt to execute the command
			client.commands.get(command).execute(message, args);
		} catch (error) {
			// Log errors and let the user know something went wrong.
			console.error(error);
			message.channel.send('There was an error trying to execute that command.');
		}
	}

	// If there is a file extension
	if (file[1] != undefined) {
		const query = message.content.slice(0, -4);
		switch (file[1]) {
		case 'gif':
			if (debug) console.log(query);

			if (!client.gifs.has(file[0])) {
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
		case 'pasta':
			// const pastaName = args[0].splice(args[0].search(/\.(?:.(?!\\))+$/gim))
			if (debug) console.log(file[0]);

			if (!client.pastas.has(file[0])) {
				message.reply('Sorry I couldn\'t find that gif.');
			} else {
				message.channel.send(client.pastas.get(file[0]).content);
			}
			break;
		default:
			break;
		}
	}

	
});