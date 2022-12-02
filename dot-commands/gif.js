const fn = require('../functions');
const axios = require('axios');
const dotenv = require('dotenv').config();

// TODO: Tenor has changed API versions, switch from TenorJS (unmaintained) to axios for
// 		general API usage. See: https://github.com/Jinzulen/TenorJS/issues/12
//		see also: https://developers.google.com/tenor/guides/migrate-from-v1

module.exports = {
	name: 'gif',
	description: 'Send a GIF',
	usage: '<GIF name or Search Query>.gif',
	async execute(message, commandData) {
		// if (message.deletable) message.delete();
		const client = message.client;
		if (!client.gifs.has(commandData.args)) {
			if (process.env.isDev) console.log('https://tenor.googleapis.com/v2/search?' + `&q=${commandData.args}` + `&key=${process.env.tenorAPIKey}` + '&limit=1&contentfilter=off');
			const q = await axios.get(
				'https://tenor.googleapis.com/v2/search?' +
				`&q=${commandData.args}` +
				`&key=${process.env.tenorAPIKey}` +
				'&limit=1' +
				`&contentfilter=off`
			).then(res => {
				if (process.env.isDev) console.log(res.data.results);
				if (res.data.results[0] == undefined) {
					message.reply('Sorry I was unable to find a GIF of ' + commandData.args);
					return;
				};
				commandData.embed_url = res.data.results[0].url;
				message.reply(commandData.embed_url);
			}).catch(err => console.error(err));
			// tenor.Search.Query(commandData.args, "1").then(res => {
			// 	if (res[0] == undefined) {
			// 		message.reply('Sorry I was unable to find a GIF of ' + commandData.args);
			// 		return;
			// 	};
			// 	commandData.embed_url = res[0].media[0].gif.url;
			// 	// message.reply(fn.embeds.gif(commandData));
			// 	// message.channel.send(`> ${commandData.author} - ${commandData.args}.gif`);
			// 	// message.channel.send(commandData.embed_url);
			// 	message.reply(commandData.embed_url);
			// }).catch(err => console.error(err));
		} else {
			// message.reply(commandData.args + ' requested by ' + message.author.username + '\n' + client.gifs.get(commandData.args).embed_url);
			commandData.embed_url = client.gifs.get(commandData.args).embed_url;
			// message.reply(fn.embeds.gif(commandData));
			// message.channel.send(`> ${commandData.author} - ${commandData.args}.gif`);
			// message.channel.send(commandData.embed_url);
			message.reply(commandData.embed_url);
		}
	}
}