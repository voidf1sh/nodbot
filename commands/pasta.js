const functions = require('../functions.js');

module.exports = {
	name: 'pasta',
	description: 'Send a copypasta.',
	usage: '<Copypasta Name>',
	execute(message, file) {
		const client = message.client;
		const replyHeader = `\'${file.name}\' requested by: ${message.author.username}\n`;
		let replyBody = '';
		if (!client.pastas.has(file.name)) {
			replyBody = 'Sorry I couldn\'t find that pasta.';
		} else {
			replyBody = client.pastas.get(file.name).content;
		}
		message.channel.send(functions.textEmbed(replyBody, message.author, `${file.name}.${file.extension}`));
	}
}