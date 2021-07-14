const functions = require('../functions.js');

module.exports = {
	name: 'spongebob',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text you want spongebob-ified',
	execute(message, file) {
		let flipper = 0;
		let newText = '';
		for (const letter of file.name) {
			if (flipper == 0) {
				newText = newText + letter.toUpperCase();
				flipper = 1;
			} else {
				newText = newText + letter;
				flipper = 0;
			}
		}
		message.channel.send(functions.createTextEmbed({ content: newText }, message.author, `.${file.extension}`));
	}
}