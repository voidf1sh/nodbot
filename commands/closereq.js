const fn = require('../functions.js');

module.exports = {
	name: 'closereq',
	description: 'Close a given request by ID',
	usage: '<request_id>',
	execute(message, file) {
		fn.closeRequest(file.name);
		message.channel.send(fn.textEmbed('Request closed.', message.author, file.extension));
	}
}