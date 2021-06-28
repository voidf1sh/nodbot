module.exports = {
	name: "get-ext",
	description: "Test function to capture the extension from the content of a message.",
	execute(message, args) {
		const finalWord = args.pop();
		const file = finalWord.split('.');
		console.log(file);
		message.reply('The extension is: ' + file[1] + '\nThe filename is: ' + file[0]);
	}
}