/* eslint-disable comma-dangle */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
// Assignment of environment variables
const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbName = process.env.dbName;
const dbPass = process.env.dbPass;
const dbPort = process.env.dbPort;

// filesystem
const fs = require('fs');

// D.js
const Discord = require('discord.js');

// Fuzzy text matching for db lookups
const FuzzySearch = require('fuzzy-search');

// Various imports
const config = require('./config.json');
const strings = require('./strings.json');
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));
const dotCommandFiles = fs.readdirSync('./dot-commands/').filter(file => file.endsWith('.js'));

// MySQL
const mysql = require('mysql');
const db = new mysql.createConnection({
	host: dbHost,
	user: dbUser,
	password: dbPass,
	database: dbName,
	port: dbPort,
});

const functions = {
	collections: {
		slashCommands(client) {
			if (!client.slashCommands) client.slashCommands = new Discord.Collection();
			client.slashCommands.clear();
			for (const file of slashCommandFiles) {
				const slashCommand = require(`./slash-commands/${file}`);
				if (slashCommand.data != undefined) {
					client.slashCommands.set(slashCommand.data.name, slashCommand);
				}
			}
			if (config.isDev) console.log('Slash Commands Collection Built');
		},
		setvalidCommands(client) {
			for (const entry of client.dotCommands.map(command => command.name)) {
				config.validCommands.push(entry);
			}
			if (config.isDev) console.log('Valid Commands Added to Config');
		},
		dotCommands(client) {
			if (!client.dotCommands) client.dotCommands = new Discord.Collection();
			client.dotCommands.clear();
			for (const file of dotCommandFiles) {
				const dotCommand = require(`./dot-commands/${file}`);
				client.dotCommands.set(dotCommand.name, dotCommand);
			}
			if (config.isDev) console.log('Dot Commands Collection Built');
		},
		gifs(rows, client) {
			if (!client.gifs) client.gifs = new Discord.Collection();
			client.gifs.clear();
			for (const row of rows) {
				const gif = {
					id: row.id,
					name: row.name,
					embed_url: row.embed_url
				};
				client.gifs.set(gif.name, gif);
			}
			if (config.isDev) console.log('GIFs Collection Built');
		},
		joints(rows, client) {
			if (!client.joints) client.joints = new Discord.Collection();
			client.joints.clear();
			for (const row of rows) {
				const joint = {
					id: row.id,
					content: row.content
				};
				client.joints.set(joint.id, joint);
			}
			if (config.isDev) console.log('Joints Collection Built');
		},
		pastas(rows, client) {
			if (!client.pastas) client.pastas = new Discord.Collection();
			client.pastas.clear();
			for (const row of rows) {
				const pasta = {
					id: row.id,
					name: row.name,
					content: row.content,
					iconUrl: row.iconurl,
				};
				client.pastas.set(pasta.name, pasta);
			}
			if (config.isDev) console.log('Pastas Collection Built');
		},
		requests(rows, client) {
			if (!client.requests) client.requests = new Discord.Collection();
			client.requests.clear();
			for (const row of rows) {
				const request = {
					id: row.id,
					author: row.author,
					request: row.request,
				};
				client.requests.set(request.id, request);
			}
			if (config.isDev) console.log('Requests Collection Built');
		},
		strains(rows, client) {
			if (!client.strains) client.strains = new Discord.Collection();
			client.strains.clear();
			for (const row of rows) {
				const strain = {
					id: row.id,
					name: row.name,
				};
				client.strains.set(strain.name, strain);
			}
			if (config.isDev) console.log('Strains Collection Built');
		}
	},
	dot: {
		getCommandData(message) {
			const commandData = {};
			// Split the message content at the final instance of a period
			const finalPeriod = message.content.lastIndexOf('.');
			if (finalPeriod < 0) {
				commandData.isCommand = false;
				commandData.args = message.content.slice(0,finalPeriod).toLowerCase();
				commandData.command = message.content.slice(finalPeriod).replace('.','').toLowerCase();
				commandData.author = `${message.author.username}#${message.author.discriminator}`;
				return commandData;
			}
			commandData.isCommand = true;
			commandData.args = message.content.slice(0,finalPeriod).toLowerCase();
			commandData.command = message.content.slice(finalPeriod).replace('.','').toLowerCase();
			commandData.author = `${message.author.username}#${message.author.discriminator}`;
			return this.checkCommand(commandData);
		},
		checkCommand(commandData) {
			if (commandData.isCommand) {
				const validCommands = require('./config.json').validCommands;
				commandData.isValid = validCommands.includes(commandData.command);
			}
			else {
				commandData.isValid = false;
				console.error('Somehow a non-command made it to checkCommands()');
			}
			return commandData;
		}
	},
	embeds: {
		help(interaction) {
			// Construct the Help Embed
			const helpEmbed = new Discord.MessageEmbed()
				.setColor('BLUE')
				.setAuthor('Help Page')
				.setDescription(strings.help.description)
				.setThumbnail(strings.urls.avatar);

			// Construct the Slash Commands help

			let slashCommandsFields = [];

			const slashCommandsMap = interaction.client.slashCommands.map(e => {
				return {
					name: e.data.name,
					description: e.data.description
				};
			})

			for (const e of slashCommandsMap) {
				slashCommandsFields.push({
					name: `- /${e.name}`,
					value: e.description,
					inline: false,
				});
			}

			// Construct the Dot Commands Help
			let dotCommandsFields = [];

			const dotCommandsMap = interaction.client.dotCommands.map(e => {
				return {
					name: e.name,
					description: e.description,
					usage: e.usage
				};
			});

			for (const e of dotCommandsMap) {
				dotCommandsFields.push({
					name: `- .${e.name}`,
					value: `${e.description}\nUsage: ${e.usage}`,
					inline: false,
				});
			}

			helpEmbed.addField('Slash Commands', strings.help.slash);
			helpEmbed.addFields(slashCommandsFields);
			helpEmbed.addField('Dot Commands', strings.help.dot);
			helpEmbed.addFields(dotCommandsFields);

			return { embeds: [
				helpEmbed
			]};
		},
		gif(commandData) {
			return { embeds: [new Discord.MessageEmbed()
				.setAuthor(`${commandData.args}.${commandData.command}`)
				.setImage(commandData.embed_url)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		pasta(commandData) {
			return { embeds: [ new Discord.MessageEmbed()
				.setAuthor(`${commandData.args}.${commandData.command}`)
				.setDescription(commandData.content)
				.setThumbnail(commandData.iconUrl)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		pastas(commandData) {
			const pastasArray = [];
			const pastasEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			for (const row of commandData.pastas) {
				pastasArray.push(`#${row.id} - ${row.name}.pasta`);
			}

			const pastasString = pastasArray.join('\n');
			pastasEmbed.setDescription(pastasString);

			return { embeds: [pastasEmbed] };
		},
		gifs(commandData) {
			const gifsArray = [];
			const gifsEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			for (const row of commandData.gifs) {
				gifsArray.push(`#${row.id} - ${row.name}.gif`);
			}

			const gifsString = gifsArray.join('\n');
			gifsEmbed.setDescription(gifsString);

			return { embeds: [gifsEmbed] };
		},
		text(commandData) {
			return { embeds: [new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setDescription(commandData.content)
				.setTimestamp()
				.setFooter(commandData.author)]};
		},
		requests(commandData) {
			const requestsEmbed = new Discord.MessageEmbed()
				.setAuthor(commandData.command)
				.setTimestamp()
				.setFooter(commandData.author);

			const requestsArray = [];

			for (const row of commandData.requests) {
				requestsArray.push(
					`**#${row.id} - ${row.author}**`,
					`Request: ${row.request}`
				);
			}

			requestsEmbed.setDescription(requestsArray.join('\n'));

			return { embeds: [requestsEmbed]};
		},
		strain(commandData, message) {
			const strainEmbed = new Discord.MessageEmbed()
				.setAuthor(`${commandData.command} #${commandData.strainInfo.id}`)
				.setTimestamp()
				.setFooter(commandData.author);
			const { strainInfo } = commandData;
			strainEmbed.addFields([
				{
					name: 'Strain Name',
					value: `${strainInfo.name}`,
				},
				{
					name: 'Type',
					value: `${strainInfo.type}`,
					inline: true,
				},
				{
					name: 'Effects',
					value: `${strainInfo.effects}`,
					inline: true,
				},
				{
					name: 'Treats',
					value: `${strainInfo.ailments}`,
					inline: true,
				},
				{
					name: 'Flavor',
					value: `${strainInfo.flavor}`,
					inline: true,
				},
			]);

			message.reply({ embeds: [ strainEmbed ]});
		},
	},
	collect: {
		gifName(interaction) {
			const gifNameFilter = m => m.author.id == strings.temp.gifUserId;
			return interaction.channel.createMessageCollector({ filter: gifNameFilter, time: 30000 });
		},
	},
	upload: {
		request(commandData, client) {
			const query = `INSERT INTO requests (author, request, status) VALUES ('${commandData.author}','${commandData.args}','Active')`;
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.requests(client);
			});
			db.end();
		},
		pasta(pastaData, client) {
			const query = `INSERT INTO pastas (name, content) VALUES ('${pastaData.name}','${pastaData.content}')`;
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.pastas(client);
			});
			db.end();
		},
		joint(content, client) {
			const query = `INSERT INTO joints (content) VALUES ('${content}')`;
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.joints(client);
			});
			db.end();
		},
		gif(gifData, client) {
			const query = `INSERT INTO gifs (name, embed_url) VALUES ('${gifData.name}', '${gifData.embed_url}')`;
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.gifs(client);
			});
			db.end();
		}
	},
	download: {
		requests(client) {
			const query = 'SELECT * FROM requests WHERE status = \'Active\' ORDER BY id ASC';
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.requests(rows, client);
			});
			db.end();
		},
		pastas(client) {
			const query = 'SELECT * FROM pastas ORDER BY id ASC';
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.pastas(rows, client);
			});
			db.end();
		},
		gifs(client) {
			const query = 'SELECT * FROM gifs ORDER BY id ASC';
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.gifs(rows, client);
			});
			db.end();
		},
		joints(client) {
			const query = 'SELECT * FROM joints ORDER BY id ASC';
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.joints(rows, client);
			});
			db.end();
		},
		strain(commandData, message) {
			const { strainName } = commandData;
			const query = `SELECT id, name, type, effects, ailment, flavor FROM strains WHERE name = '${strainName}'`;
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (rows != undefined) {
					commandData.strainInfo = {
						id: `${rows[0].id}`,
						name: `${rows[0].name}`,
						type: `${rows[0].type}`,
						effects: `${rows[0].effects}`,
						ailments: `${rows[0].ailment}`,
						flavor: `${rows[0].flavor}`,
					};
					functions.embeds.strain(commandData, message);
				}
			});
			db.end();
		},
		strains(client) {
			const query = 'SELECT id, name FROM strains';
			db.connect();
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.strains(rows, client);
			});
			db.end();
		},
	},
	weed: {
		strain: {
			lookup(strainName, client) {
				const strainSearcher = new FuzzySearch(client.strains.map(e => e.name));
				const name = strainSearcher.search(strainName)[0];
				if (name != undefined) {
					return name;
				} else {
					return false;
				}
			},
			submit(strainName) {
				return strainName;
			}
		}
	},
	// Parent-Level functions (miscellaneuous)
	closeRequest(requestId, client) {
		const query = `UPDATE requests SET status = 'Closed' WHERE id = ${requestId}`;
		db.connect();
		db.query(query, (err, rows, fields) => {
			if (err) throw err;
			functions.download.requests(client);
		});
		db.end();
	},
	spongebob(commandData) {
		let flipper = 0;
		let newText = '';
		for (const letter of commandData.args) {
			if (letter == ' ') {
				newText = newText + letter;
				continue;
			}
			if (letter == 'i' || letter == 'I') {
				newText = newText + 'i';
				continue;
			}
			if (letter == 'l' || letter == 'L') {
				newText = newText + 'L';
				continue;
			}
			if (flipper == 0) {
				newText = newText + letter.toUpperCase();
				flipper = 1;
			} else {
				newText = newText + letter;
				flipper = 0;
			}
		}

		return newText;
	},
};

module.exports = functions;