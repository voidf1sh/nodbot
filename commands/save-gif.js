module.exports = {
	name: 'save-gif',
	description: 'Adds a given gif to the hardcoded list.',
	execute(message, args) {
		if (args.length != 2) {
			message.reply('This command requires exactly two arguments, gif name and url. Please try again.');
			return;
		}

		const fs = require('fs');
		fs.appendFile(`./gifs/${args[0]}.js`, `module.exports = {\n\tname: '${args[0]}',\n\tembed_url: '${args[1]}'\n}`, function(err) {
			if (err) throw err;
			console.log('Saved file!');
			const gif = require(`../gifs/${args[0]}.js`);
			message.client.gifs.set(gif.name, gif);
		});

		message.reply('GIF saved as: ' + args[0] + '.gif!');
	}
}