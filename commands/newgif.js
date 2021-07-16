const functions = require('../functions.js');

module.exports = {
	name: 'newgif',
	description: '',
	execute(message, file) {
        const data = {
            "embed_url": 'https://imgur.com/a/IMxDZZ7'
        }
		message.channel.send(functions.createGifEmbed(data, message.author, Object.values(file).join('.')));
	}
}