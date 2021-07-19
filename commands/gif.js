const functions = require('../functions');
const tenor = require('tenorjs').client({
    "Key": process.env.tenorAPIKey, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = {
	name: 'gif',
	description: 'Send a GIF',
	usage: '<GIF name or Search Query>',
	execute(message, file) {
		const client = message.client;
		if (!client.gifs.has(file.name)) {
			tenor.Search.Query(file.name, 1).then(res => {
				if (res[0] == undefined) return;
				const gifInfo = {
					'name': file.name,
					'embed_url': res[0].media[0].gif.url
				};
				message.channel.send(functions.createGifEmbed(gifInfo, message.author, `${file.name}.${file.extension} - Tenor`));
			})
			.catch(err => console.error(err));
		} else {
			// message.channel.send(file.name + ' requested by ' + message.author.username + '\n' + client.gifs.get(file.name).embed_url);
			const gifInfo = {
				'name': file.name,
				'embed_url': client.gifs.get(file.name).embed_url
			};
			message.channel.send(functions.createGifEmbed(gifInfo, message.author, `${file.name}.${file.extension} - Saved`));
		}
	}
}