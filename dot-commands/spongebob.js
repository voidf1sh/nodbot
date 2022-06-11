const fn = require('../functions.js');
const config = require('../config.json');

module.exports = {
	name: 'spongebob',
	alias: 'sb',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text to convert>.spongebob',
	execute(message, commandData) {
		message.reply(fn.spongebob(commandData));
	}
}