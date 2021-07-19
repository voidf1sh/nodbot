const functions = require('../functions.js');

module.exports = {
	name: 'help',
	description: 'Shows the help page.',
	execute(message, file) {
		message.author.createDM()
			.then(dmChannel => {
				dmChannel.send(functions.createHelpEmbed(message)).then().catch(err => console.error(err));
				message.reply('I\'ve DM\'d you a copy of my help message!');
			}).catch(err => console.error(err));
	},
};