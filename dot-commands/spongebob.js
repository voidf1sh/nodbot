const fn = require('../functions.js');
const config = require('../config.json');

module.exports = {
	name: 'spongebob',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text to convert>.spongebob',
	execute(message, commandData) {
		message.reply(`@${message.author.username}: ${fn.spongebob(commandData)}`);
	}
}