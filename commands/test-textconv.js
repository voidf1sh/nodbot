module.exports = {
	name: "test-textconv",
	description: "Give the bot some text to convert and send back.",
	execute(message, args) {
		console.log(args);
		const textPre = args.join(' ');
		const textPost1 = textPre.replace(/\n/,'\n');
		const textPost2 = textPost1.replace(/\'/,'\'');
		console.log(textPost1);
		console.log(textPost2);
	}
}