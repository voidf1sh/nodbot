const functions = require('../functions.js');

module.exports = {
	name: 'mapcommands',
	description: '',
	execute(message, file) {
		console.log(functions.mapCommands(message));
	}
}