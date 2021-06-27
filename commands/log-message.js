module.exports = {
	name: "log-message",
	description: "Logs the message to console for debugging purposes.",
	execute(message, args) {
		console.log(message);
	}
}