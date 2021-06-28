/* eslint-disable quotes */
module.exports = {
	name: "reload-gifs",
	description: "Refresh the hardcoded gif library.",
	execute(message, args) {
		const functions = require('../functions.js');
		functions.getGifFiles(message.client);
	}
}