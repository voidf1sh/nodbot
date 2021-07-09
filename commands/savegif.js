module.exports = {
	name: 'savegif',
	description: 'Adds a given gif to the hardcoded list.',
	usage: '<https://link.to.gif> <gif_name>',
	execute(message, file) {
		const tempArray = file.name.split(' ');
		const embedURL = tempArray.shift();
		const gifName = tempArray.join(' ');

		const fs = require('fs');
		fs.appendFile(`./gifs/${gifName}.js`, `module.exports = {\n\tname: '${gifName}',\n\tembed_url: '${embedURL}'\n}`, function(err) {
			if (err) throw err;
			console.log('Saved file!');
			const gif = require(`../gifs/${gifName}.js`);
			message.client.gifs.set(gif.name, gif);
		});

		message.reply('GIF saved as: ' + gifName + '.gif!');
	}
}