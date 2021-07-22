module.exports = {
	name: 'upload',
	description: '',
	execute(message, file) {
		const fn = require('../functions');

		fn.uploadGIFs(message);

		message.reply('Uploaded, I hope.');
	}
}