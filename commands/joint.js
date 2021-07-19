const { emoji } = require('../config.json');
const { weed } = require('../src/strings.json');

module.exports = {
	name: 'joint',
	description: 'Pass the joint!',
	execute(message, args) {
		const randIndex = Math.floor(Math.random() * weed.length);
		message.channel.send(`${weed[randIndex]} ${emoji.joint}`);
	}
}