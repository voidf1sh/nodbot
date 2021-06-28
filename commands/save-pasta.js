module.exports = {
	name: 'save-pasta',
	description: 'Adds a given copypasta to the hardcoded list.',
	execute(message, args) {
		const fs = require('fs');
		const filename = args.shift();
		const pastaText = args.join(' ');
		fs.appendFile(`./pastas/${filename}.js`, `module.exports = {\n\tname: '${filename}',\n\tcontent: '${pastaText}'\n}`, function(err) {
			if (err) throw err;
			console.log('Saved file!');
			const pasta = require(`../pastas/${filename}.js`);
			message.client.pastas.set(pasta.name, pasta);
		});

		message.reply('GIF saved as: ' + filename + '.pasta!');
	}
} 