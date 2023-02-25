// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes } = require('discord.js');
const botId = process.env.BOTID;
const token = process.env.TOKEN;
const fs = require('fs');

console.log(`Token: ...${token.slice(-5)} | Bot ID: ${botId}`);

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started clearing global application (/) commands.');

		await rest.put(
			Routes.applicationCommands(botId),
			{ body: '' },
		);

		console.log('Successfully cleared global application (/) commands.');
		process.exit();
	} catch (error) {
		console.error(error);
	}
})();