const fs = require('fs');
const strings = require('../src/strings.json');

module.exports = {
	name: 'roll',
	description: 'Add a phrase to the .joint command',
	usage: '<phrase to save>',
	execute(message, file) {
		strings.weed.push(file.name);
		fs.writeFile('./src/strings.json', JSON.stringify(strings), err => {
			if (err) throw err;

			message.channel.send('It has been added to the list');
		})
	}
}