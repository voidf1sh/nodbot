/* eslint-disable brace-style */
// Variable Assignment
const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js');
const client = new Discord.Client();

// const config = require('./config.json');
// const { prefix, logChannel, bootMessage, shutdownMessage } = require('./config.json');

// const  owner = process.env.ownerID;
const giphy = require('giphy-api')(process.env.giphyAPIKey);
const functions = require('./functions.js');


client.once('ready', () => {
	console.log('Ready');
	client.user.setActivity('Nod Simulator 2021', { type: 'PLAYING' }).then().catch(console.error);
	functions.getCommandFiles(client);
	functions.getGifFiles(client);
	functions.getPastaFiles(client);
	// client.channels.fetch(logChannel)
	// 	.then(channel => {
	// 		channel.send(bootMessage)
	// 			.then()
	// 			.catch(err => console.error(err));
	// 	})	
	// 	.catch(err => console.error(err));
});

client.login(process.env.TOKEN)
	.then()
	.catch(err => {
		console.error(err);
		console.log('Token: ' + process.env.TOKEN)
	});

client.on('message', message => {
	// Get the filename and extension as an array
	const file = functions.getFileInfo(message.content);
	if (!file) return;
	// If the message is from a bot, or doesn't have a valid file extension, stop here.
	if (functions.extIsValid(file.extension) == false || message.author.bot) return;

	// If the command collection doesn't contain the given command, stop here.
	if (!client.commands.has(file.extension)) return;

	try {
		// Attempt to execute the command
		client.commands.get(file.extension).execute(message, file);
	} catch (error) {
		// Log errors and let the user know something went wrong.
		console.error(error);
		message.channel.send('There was an error trying to execute that command.');
	}

	// Try to delete the requester's message
	if (message.deletable) {
		message.delete().then().catch(err => console.error(err));
	}
});