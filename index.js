/* eslint-disable brace-style */
// Variable Assignment
const dotenv = require('dotenv');
const Discord = require('discord.js');
const client = new Discord.Client();
const giphy = require('giphy-api')(process.env.giphyAPIKey);
const debug = true;
const links = require('./links.json');

dotenv.config();
const owner = process.env.ownerID;

if (debug) {
	console.log(links);
}

client.once('ready', () => {
	console.log('Ready');
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const pre = message.content.slice(0, -4);
	const ext = message.content.slice(-4);
	let gifFound = false;

	switch (ext) {
	case '.gif':
		if (debug) {
			console.log('pre: ' + pre);
			console.log('ext: ' + ext);
		}
		for (let index = 0; index < links.gifs.length; index++) {
			const gif = links.gifs[index];
			if (gif.name == pre) {
				message.channel.send(gif.embed_url);
				gifFound = true;
			}
		}
		if (gifFound == false) {
			try {
				giphy.search(pre, function(err, res) {
					if (res.data[0] != undefined) {
						message.channel.send(res.data[0].embed_url);
					} else {
						message.channel.send('Sorry, I was unable to find a gif of ' + pre + '.');
					}
					if (err) {
						console.log(err);
					}
				});
			} catch (error) {
				console.log(error);
			}
		}
		break;
	// Admin Commands
	case '.adm':
		if (message.member.id == process.env.ownerID) {
			switch (pre) {
			case 'kill':
				client.destroy();
				process.exit();
				break;
			default:
				break;
			}
		}
		break;
	case '.req':
		message.channel.send('Feedback Submitted: ' + pre);
		client.users.fetch(owner).then(user => { user.send('Feedback/Request: ' + pre);});
		break;
	default:
		break;
	}
});