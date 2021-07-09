module.exports = {
	name: 'spongebob',
	description: 'SpOnGeBoB-iFy AnYtHiNg AuToMaTiCaLly',
	usage: '<text you want spongebob-ified',
	execute(message, file) {
		const replyHeader = `Requested by: ${message.author.username}\n`;
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
		message.channel.send(replyHeader + newText);
	}
}