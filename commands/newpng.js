const functions = require('../functions.js');

module.exports = {
	name: 'newpng',
	description: '',
	execute(message, file) {
        const data = {
            "embed_url": 'https://imgur.com/gallery/5ausYBw'
        }
		message.channel.send(functions.createGifEmbed(data, message.author, Object.values(file).join('.')));
	}
}