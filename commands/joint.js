const { emoji } = require('../src/strings.json');

module.exports = {
	name: 'joint',
	description: 'Pass the joint!',
	execute(message, args) {
		let phrases = [];
		for (const entry of message.client.potphrases.map(potphrase => potphrase.content)) {
			phrases.push(entry);
		}
		const randIndex = Math.floor(Math.random() * phrases.length);
		message.channel.send(`${phrases[randIndex]} ${emoji.joint}`);
	}
}