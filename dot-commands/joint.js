const fn = require('../functions.js');
const { emoji } = require('../strings.json');

module.exports = {
	name: 'joint',
	description: 'Send a random weed-themed phrase.',
	usage: '.joint',
	execute(message, commandData) {
		let joints = [];
		for (const entry of message.client.joints.map(joint => joint.content)) {
			joints.push(entry);
		}
		const randIndex = Math.floor(Math.random() * joints.length);
		message.reply(`${joints[randIndex]} ${emoji.joint}`);
	}
}