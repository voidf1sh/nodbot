module.exports = {
	name: 'joints',
	description: 'Get a list of the phrases saved for .joint',
	execute(message, file) {
		let phrases = [];

		for (const phrase of message.client.potphrases.map(potphrase => potphrase.content)) {
			phrases.push(phrase);
		}
		message.channel.send('Here are all the `.joint` phrases I have saved:\n\n' + phrases.join('\n'));
	}
}