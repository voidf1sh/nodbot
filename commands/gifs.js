const functions = require('../functions.js');

module.exports = {
	name: 'gifs',
	description: 'Get a list of saved GIFs',
	execute(message, file) {
		message.author.createDM().then(channel => {
			channel.send(functions.createGIFList(message));
			message.reply('I\'ve sent you a DM with a list of saved GIFs.')
		}).catch(err => message.channel.send('Sorry I was unable to send you a DM.'));
	}
}