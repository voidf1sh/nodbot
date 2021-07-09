const ownerID = process.env.ownerID;

module.exports = {
	name: 'kill',
	description: 'Kills the bot OWNER ONLY',
	execute(message, args) {
		if (message.author.id == ownerID) {
			message.channel.send('Shutting down the bot...')
				.then(() => {
					message.client.destroy();
					process.exit();
				});
		} else {
			message.reply('Sorry, only the owner can do that.');
			message.client.users.fetch(ownerID)
				.then(user => {
					user.send(message.author.username + ' attempted to shutdown the bot.')
						.then()
						.catch(err => console.error(err));
				})
				.catch(err => console.error(err));
		}
	}
}