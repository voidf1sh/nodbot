const functions = require('../functions.js');

module.exports = {
	name: 'pastas',
	description: 'Get a list of saved copypastas',
	execute(message, file) {
		message.author.createDM().then(channel => {
			channel.send(functions.createPastaList(message));
			message.channel.send('I\'ve sent you a DM with a list of saved copypastas.')
		}).catch(err => message.channel.send('Sorry I was unable to send you a DM.'));
	}
}