const functions = require('../functions');

const giphy = require('giphy-api')(process.env.giphyAPIKey);
module.exports = {
	name: 'gif',
	description: 'Send a GIF',
	execute(message, file) {
		const client = message.client;
		if (!client.gifs.has(file.name)) {
			giphy.search(file.name).then(function (res) {
				if (res.data[0] != undefined) {
					// message.channel.send(file.name + ' requested by ' + message.author.username + '\n' + res.data[0].embed_url).then().catch(console.error);
					const gifInfo = {
						'name': file.name,
						'embed_url': res.data[0].images.original.url,
						'author': message.author,
					};
					message.channel.send(functions.createGifEmbed(gifInfo));
				} else {
					message.channel.send('I was unable to find a gif of ' + file.name);
				}
			})
			.catch(err => console.error(err));
		} else {
			// message.channel.send(file.name + ' requested by ' + message.author.username + '\n' + client.gifs.get(file.name).embed_url);
			const gifInfo = {
				'name': file.name,
				'embed_url': client.gifs.get(file.name).embed_url,
				'author': message.author,
			};
			message.channel.send(functions.createGifEmbed(gifInfo, message.author, `${file.name}.${file.extension}`));
		}
	}
}