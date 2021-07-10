const giphy = require('giphy-api')(process.env.giphyAPIKey);
const functions = require('../functions');
const { emoji } = require('../config.json');

module.exports = {
	name: 'savegif',
	description: 'Adds a given gif to the hardcoded list.',
	usage: '<search query>',
	execute(message, file) {
		message.author.createDM()
			.then(channel => {
				const query = file.name;
				giphy.search(query)
					.then(res => {
						if (res.data == undefined) return;
						if (res.data[0] == undefined) {
							channel.send('Sorry, I wasn\'t able to find a GIF of ' + file.name);
							return;
						}
						let i = 0; 
						const data = {
							"name": file.name,
							"embed_url": res.data[i].images.original.url,
							"author": message.author
						};
						let embed = functions.createGifEmbed(data);

						channel.send(embed)
							.then(selfMessage => {
								selfMessage.react(emoji.previous).then(() => {
									selfMessage.react(emoji.confirm).then(() => {
										selfMessage.react(emoji.next);
									});
								});
								const filter = (reaction, user) => {
									return ((reaction.emoji.name == emoji.next) || (reaction.emoji.name == emoji.confirm) || (reaction.emoji.name == emoji.previous)) && user.id == message.author.id;
								}
								const collector = selfMessage.createReactionCollector(filter, { time: 120000 });

								collector.on('collect', (reaction, user) => {
									switch (reaction.emoji.name) {
										case emoji.next:
											i++;
											data.embed_url = res.data[i].images.original.url;
											embed = functions.createGifEmbed(data);
											if (selfMessage.editable) {
												selfMessage.edit(embed);
											}
											break;
										case emoji.confirm:
											channel.send('Saving GIF: ' + res.data[i].images.original.url);
											functions.saveGif(message, data.name, data.embed_url);
											break;
										case emoji.previous:
											i--;
											data.embed_url = res.data[i].images.original.url;
											embed = functions.createGifEmbed(data);
											if (selfMessage.editable) {
												selfMessage.edit(embed);
											}
											break;
										default:
											channel.send('There was an error, sorry.');
											break;
									}
								})
							}).catch(err => console.error(err));
					})
					.catch(err => console.error(err));
			})
			.catch(err => console.error(err));
	}
}