const giphy = require('giphy-api')(process.env.giphyAPIKey);
module.exports = {
	name: 'gif',
	description: 'Send a GIF',
	execute(message, file) {
		const client = message.client;
		if (!client.gifs.has(file.name)) {
			giphy.search(file.name, (err, res) => {
				if (res.data[0] != undefined) {
					message.channel.send(file.name + ' requested by ' + message.author.username + '\n' + res.data[0].embed_url).then().catch(console.error);
				} else {
					message.channel.send('I was unable to find a gif of ' + file.name);
				}
				if (err) console.error(err);
			});
		} else {
			message.channel.send(file.name + ' requested by ' + message.author.username + '\n' + client.gifs.get(file.name).embed_url);
		}
	}
}