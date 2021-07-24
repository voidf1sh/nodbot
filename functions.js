const Discord = require('discord.js');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const config = require('./config.json');
const pg = require('pg');
let dbConnected = false;
const db = new pg.Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

db.connect();

module.exports = {
	setValidExtensions(client) {
		for (const entry of client.commands.map(command => command.name)) {
			config.validExtensions.push(entry);
		}
	},
	getCommandFiles(client) {
		if (!client.commands) client.commands = new Discord.Collection();
		client.commands.clear();
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
	},
	getGifFiles(client) {
		if (!client.gifs) client.gifs = new Discord.Collection();
		client.gifs.clear();
		const query = "SELECT name, embed_url FROM gifs";
		return new Promise((resolve, reject) => {
			db.query(query)
				.then(res => {
					for (let row of res.rows) {
						const gif = {
							name: row.name,
							embed_url: row.embed_url
						};
						client.gifs.set(gif.name, gif);
					}
					resolve();
				})
				.catch(err => console.error(err));
		});
	},
	getPotPhrases(client) {
		if (!client.potphrases) client.potphrases = new Discord.Collection();
		client.potphrases.clear();
		const query = "SELECT id, content FROM potphrases";
		db.query(query)
			.then(res => {
				for (let row of res.rows) {
					const potphrase = {
						id: row.id,
						content: row.content
					};
					client.potphrases.set(potphrase.id, potphrase);
				}
			})
			.catch(err => console.error(err));
	},
	getPastaFiles(client) {
		if (!client.pastas) client.pastas = new Discord.Collection();
		client.pastas.clear();
		const query = "SELECT name, content FROM pastas";
		return new Promise((resolve, reject) => {
			db.query(query)
			.then(res => {
				for (let row of res.rows) {
					const pasta = {
						name: row.name,
						content: row.content
					};
					client.pastas.set(pasta.name, pasta);
				}
				resolve();
			})
			.catch(err => console.error(err));
		});
		
	},
	reload(client) {
		this.getCommandFiles(client);
		this.getGifFiles(client);
		this.getPastaFiles(client);
		this.getPotPhrases(client);
	},
	getFileInfo(content) {
		// Split the message content at the final instance of a period
		const finalPeriod = content.lastIndexOf('.');
		if (finalPeriod < 0) return false;
		const extension = content.slice(finalPeriod).replace('.','').toLowerCase();
		const filename = content.slice(0,finalPeriod).toLowerCase();
		const file = {
			'name': filename,
			'extension': extension
		};
		return file;
	},
	extIsValid(extension) {
		const extensions = require('./config.json').validExtensions;
		return extensions.includes(extension);
	},
	cleanInput(string) {
		return string.replace(/'/g, "''").replace(/\n/g, '\\n');
	},
	createGifEmbed(data, author, command) {
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setImage(data.embed_url)
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	saveGif(message, name, embed_url) {
		const gif = {
			name: name,
			embed_url: embed_url
		};
		message.client.gifs.set(gif.name, gif);
		this.uploadGIF(name, embed_url);
	},
	savePasta(message, name, content) {
		const pasta = {
			name: name,
			content: content
		};
		message.client.pastas.set(pasta.name, pasta);
		
		const query = `INSERT INTO pastas (name, content) VALUES ('${name}','${content}')`;
		db.query(query);
		
		return "Success";
	},
	createAirportEmbed(data, author, command) {
		const airport = data.airport[0];
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setTitle(airport.airport_name)
			.addFields(
				{ name: 'Location', value: `${airport.city}, ${airport.state_abbrev}`, inline: true },
				{ name: 'Coordinates', value: `${airport.latitude}, ${airport.longitude}`, inline: true },
				{ name: 'Elevation', value: `${airport.elevation}ft`, inline: true },
				{ name: 'More Information', value: airport.link_path }
			)
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	createWeatherEmbed(data, author, command) {
		const loc = data.location;
		const weather = data.current;
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setTitle(`${loc.name}, ${loc.region}, ${loc.country} Weather`)
			.setDescription(`The weather is currently ${weather.condition.text}`)
			.addFields(
				{ name: 'Temperature', value: `${weather.temp_f}°F (Feels like: ${weather.feelslike_f}°F)`, inline: true },
				{ name: 'Winds', value: `${weather.wind_mph} ${weather.wind_dir}`, inline: true },
				{ name: 'Pressure', value: `${weather.pressure_in}inHg`, inline: true },
				{ name: 'Relative Humidity', value: `${weather.humidity}%`, inline: true }
			)
			.setThumbnail(`https:${weather.condition.icon}`)
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	createTextEmbed(data, author, command) {
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setDescription(data.content)
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	createStockEmbed(data, author, command) {
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setTitle()
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	createHelpEmbed(message) {
		const { commands } = message.client;
		let fields = [];
		for (const entry of commands.map(command => [command.name, command.description, command.usage])) {
			const name = entry[0];
			const description = entry[1];
			let usage;
			if (entry[2] == undefined) {
				usage = '';
			} else {
				usage = entry[2];
			}
			const excludeList = [
				'kill',
				'mapcommands',
				'newgif',
				'newpng',
				'oldgif',
				'strain',
				'stonk',
				'wrongbad'
			];
			if (excludeList.includes(name)) continue;
			fields.push({
				name: name,
				value: `${description}\n**Usage:** \`${usage}.${name}\``
			});
		}
		
		return new Discord.MessageEmbed()
			.setAuthor('NodBot Help')
			.setDescription('All commands are provided as "file extensions" instead of prefixes to the message.')
			.addFields(fields)
			.setTimestamp();
	},
	createGIFList(message) {
		let list = [];
		const { gifs } = message.client;
		for (const entry of gifs.map(gif => [gif.name])) {
			list.push(entry[0] + '.gif');
		}

		return new Discord.MessageEmbed()
			.setAuthor('NodBot GIF List')
			.setTitle('List of Currently Saved GIFs')
			.setDescription(list.join('\n'))
			.setTimestamp()
			.setFooter(`@${message.author.username}#${message.author.discriminator}`);
	},
	createPastaList(message) {
		let list = [];
		const { pastas } = message.client;
		for (const entry of pastas.map(pasta => [pasta.name])) {
			list.push(entry[0] + '.pasta');
		}

		return new Discord.MessageEmbed()
			.setAuthor('NodBot Pasta List')
			.setTitle('List of Currently Saved Copypastas')
			.setDescription(list.join('\n'))
			.setTimestamp()
			.setFooter(`@${message.author.username}#${message.author.discriminator}`);
	},
	uploadGIF(name, embed_url) {
		const query = `INSERT INTO gifs (name, embed_url) VALUES ('${name}','${embed_url}')`;
		db.query(query)
			.then()
			.catch(e => console.error(e));
	},
	uploadPotPhrase(content) {
		const query = `INSERT INTO potphrases (content) VALUES ('${content}')`;
		db.query(query)
			.then()
			.catch(e => console.error(e));
	}
}