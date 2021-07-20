const { weed } = require('../src/strings.json');

module.exports = {
	name: 'joints',
	description: 'Get a list of the phrases saved for .joint',
	execute(message, file) {
		let data = [];

		for (const phrase of weed) {
			data.push(phrase);
		}
		message.channel.send('Here are all the `.joint` phrases I have saved:\n\n' + data.join('\n'));
	}
}