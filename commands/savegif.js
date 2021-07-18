const tenor = require('tenorjs').client({
    "Key": process.env.tenorAPIKey, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});
const functions = require('../functions');
const { emoji } = require('../config.json');

module.exports = {
	name: 'savegif',
	description: 'Adds a given gif to the hardcoded list.',
	usage: '<search query>',
	execute(message, file) {
		const channel = message.channel;
		const query = file.name;
		tenor.Search.Query(query, 20)
			.then(res => {
				if (res[0] == undefined) {
					channel.send('Sorry, I wasn\'t able to find a GIF of ' + file.name);
					return;
				}
				let i = 0; 
				const data = {
					"name": file.name,
					"embed_url": res[0].media[0].gif.url,
					"author": message.author
				};
				let embed = functions.createGifEmbed(data, message.author, `${Object.values(file).join('.')}`);

				// Send the first GIF result as an Embed
				channel.send(embed)
					.then(selfMessage => {
						// Add reactions to go back, forward, and confirm GIF choice.
						// React order is important so these are done in a chain
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
									if (i < res.length) {
										i++;
									} else {
										selfMessage.channel.send('That\'s the last GIF, sorry!');
										break;
									}
									data.embed_url = res[i].media[0].gif.url;
									embed = functions.createGifEmbed(data, message.author, `${file.name}.${file.extension}`);
									if (selfMessage.editable) {
										selfMessage.edit(embed);
									}
									break;
								case emoji.confirm:
									channel.send('GIF Selected. What should I save the GIF as? (don\'t include the `.gif`)')
										.then(nameQueryMessage => {
											const nameCollectorFilter = nameMessage => nameMessage.author == message.author;
											const nameCollector = nameQueryMessage.channel.createMessageCollector(nameCollectorFilter, { time: 30000, max: 1 });

											nameCollector.on('collect', nameMessage => {
												channel.send('The GIF has been saved as: ' + nameMessage.content + '.gif');
												functions.saveGif(message, nameMessage.content, data.embed_url);
											});
										});
									break;
								case emoji.previous:
									if (i > 0) {
										i--;
									} else {
										selfMessage.channel.send('That\'s the first GIF, can\'t go back any further!');
										break;
									}
									data.embed_url = res[i].media[0].gif.url;
									embed = functions.createGifEmbed(data, message.author, `${file.name}.${file.extension}`);
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
	}
}