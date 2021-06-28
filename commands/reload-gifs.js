module.exports = {
	name: "reload-gifs",
	description: "Refresh the hardcoded gif library.",
	execute(message, args) {
		getGifFiles();
	}
}