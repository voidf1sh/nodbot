const functions = require('../functions.js');

module.exports = {
	name: 'savepasta',
	description: 'Adds a given copypasta to the hardcoded list.',
	usage: '<Copy Pasta Text> <pasta_name>',
	execute(message, file) {
		message.channel.send(`I'll be saving the next message you send as ${file.name}.pasta\nWhat is the content of the copypasta?`)
			.then(promptMessage => {
				const pastaFilter = pastaMessage => pastaMessage.author == message.author;
				const pastaCollector = promptMessage.channel.createMessageCollector(pastaFilter, { time: 30000, max: 1 });

				pastaCollector.on('collect', pastaMessage => {
					message.channel.send(functions.savePasta(message, file.name, functions.cleanInput(pastaMessage.content)));
				})
			})
			.catch(err => console.error(err));
	}
} 