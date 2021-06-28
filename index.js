/* eslint-disable brace-style */
// Variable Assignment
const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();

const debug = true;
// const config = require('./config.json');
const { prefix } = require('./config.json');

// const owner = process.env.ownerID;
const giphy = require('giphy-api')(process.env.giphyAPIKey);
const functions = require('./functions.js');


client.once('ready', () => {
	console.log('Ready');
	client.user.setActivity('Nod Simulator 2021', { type: 'PLAYING' }).then().catch(console.error);
	functions.getCommandFiles(client);
	functions.getGifFiles(client);
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const ext = functions.extCheck(message.content);
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
			message.guild.owner
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