module.exports = {
	name: 'help',
	description: 'Shows the help page.',
	execute(message, file) {
		const data = [];
		const { commands } = message.client;

		if (!file.name) {
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push('\nYou can send `[command name].help` to get info on a specific command!');

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		const command = commands.get(file.name) || commands.find(c => c.aliases && c.aliases.includes(file.name));

		if (!command) {
			return message.reply('That\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** \`${command.usage}.${command.name}\``);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};