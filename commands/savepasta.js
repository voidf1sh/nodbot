const functions = require('../functions.js');

module.exports = {
	name: 'savepasta',
	description: 'Adds a given copypasta to the hardcoded list.',
	execute(message, file) {
		const fs = require('fs');
		const pastaTextArray = message.content.split(' ');
		const pastaFile = functions.getFileInfo(pastaTextArray.pop());
		const pastaText = pastaTextArray.join(' ');
		const pastaTextEscaped = pastaText.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
		fs.appendFile(`./pastas/${pastaFile.name}.js`, `module.exports = {\n\tname: '${pastaFile.name}',\n\tcontent: '${pastaTextEscaped}'\n}`, function(err) {
			if (err) throw err;
			console.log('Saved file!');
			const pasta = require(`../pastas/${pastaFile.name}.js`);
			message.client.pastas.set(pasta.name, pasta);
		});

		message.reply('GIF saved as: ' + pastaFile.name + '.pasta!');
	}
} 