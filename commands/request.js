const fn = require('../functions.js');

module.exports = {
	name: 'request',
	description: 'Submit a request to the bot developer.',
	usage: '<request or feedback>',
	execute(message, file) {
		const request = file.name;
		message.channel.send(fn.textEmbed('Your request has been submitted!\nRequest: ' + request, message.author, file.extension));
		message.client.users.fetch(process.env.ownerID).then(user => {user.send(fn.textEmbed(request, message.author, file.extension));}).catch(error => { console.error(error);} );
		fn.uploadRequest(message.author, file.name);
	}
}