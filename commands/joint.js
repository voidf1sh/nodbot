const { emoji } = require('../config.json');

module.exports = {
	name: 'joint',
	description: 'Pass the joint!',
	execute(message, args) {
		message.channel.send('It\'s dangerous to go alone... take this: ' + emoji.joint);
	}
}