/* eslint-disable brace-style */
// Variable Assignment
const dotenv = require('dotenv');
const Discord = require('discord.js');
const client = new Discord.Client();
const giphy = require('giphy-api')(process.env.giphyAPIKey);
let owner;

dotenv.config();

async function getUser(id) {
	const user = await client.users.fetch(id).catch(err,() {});
	return user.data;
}

client.once('ready', () => {
	console.log('Ready');
	owner = getUser(process.env.ownerID);
	console.log(owner);
});

client.login(process.env.TOKEN);

client.on('message', message => {
	const pre = message.content.slice(0, -4);
	const ext = message.content.slice(-4);

	switch (ext) {
	case '.gif':
		try {
			const results = giphy.search(pre, function(err, res) {
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
		owner.send('Feedback/Request ' + pre);
		console.log(owner);
		break;
	default:
		break;
	}
});