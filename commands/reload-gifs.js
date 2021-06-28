module.exports = {
	name: "reload-gifs",
	description: "Refresh the hardcoded gif library.",
	execute(message, args) {
		const index = require('../index.js');
		index.getGifFiles();
	}
}