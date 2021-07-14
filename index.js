// Variable Assignment
// Environment Variable Setup
const dotenv = require('dotenv');
dotenv.config();
// Discord.js library
const Discord = require('discord.js');
// Create the client
const client = new Discord.Client();
// External Functions File
const functions = require('./functions.js');

// Once the client is logged in and ready
client.once('ready', () => {
	console.log('Ready');
	// This sets the activity that shows below the bot's name in the member/friend list
	client.user.setActivity('Nod Simulator 2021', { type: 'PLAYING' }).then().catch(console.error);
	// Import the Command, GIF, and Pasta files into collections
	functions.getCommandFiles(client);
	functions.getGifFiles(client);
	functions.getPastaFiles(client);
	// Get the owner and DM them a message that the bot is ready, useful for remote deployment
	client.users.fetch(process.env.ownerID).then(user => {
		user.createDM().then(channel => {
			channel.send('Ready');
		});
	});
});

// Log into discord using the TOKEN provided by environment variables (.env)
client.login(process.env.TOKEN)
	.then()
	.catch(err => {
		console.error(err);
		// Dump the TOKEN into the console as the TOKEN is likely the cause of any error logging in, unless Discord servers are down.
		console.log('Token: ' + process.env.TOKEN)
	});

// This runs on each message the bot sees
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