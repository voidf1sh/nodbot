module.exports = {
	name: 'request',
	description: 'Submit a request to the bot developer.',
	usage: '<request or feedback>',
	execute(message, file) {
		const request = file.name;
		message.channel.send('Your request has been submitted:\n```\n' + request + '\n```');
		message.client.users.fetch(process.env.ownerID).then(user => {user.send('New request or feedback:\n```\n' + request + '\n```');}).catch(error => { console.error(error);} );
	}
}