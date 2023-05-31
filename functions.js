/* eslint-disable comma-dangle */
// dotenv for handling environment variables
const dotenv = require('dotenv');
dotenv.config();
// Assignment of environment variables for database access
const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbName = process.env.dbName;
const dbPass = process.env.dbPass;
const dbPort = process.env.dbPort;
const isDev = process.env.isDev;

const ownerId = process.env.ownerId;

// filesystem
const fs = require('fs');

// Discord.js
const Discord = require('discord.js');

// Fuzzy text matching for db lookups
const FuzzySearch = require('fuzzy-search');

// OpenAI
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function openAIStatus(o) {
	const response = await o.listModels();
	const models = response.data.data;
	models.forEach(e => {
		console.log(`Model ID: ${e.id}`);
	});
};
openAIStatus(openai);

// Various imports from other files
const config = require('./config.json');
const strings = require('./strings.json');
const slashCommandFiles = fs.readdirSync('./slash-commands/').filter(file => file.endsWith('.js'));
const dotCommandFiles = fs.readdirSync('./dot-commands/').filter(file => file.endsWith('.js'));

// MySQL database connection
const mysql = require('mysql');
const db = new mysql.createPool({
	connectionLimit: 10,
	host: dbHost,
	user: dbUser,
	password: dbPass,
	database: dbName,
	port: dbPort,
});

const functions = {
	// Functions for managing and creating Collections
	collections: {
		// Create the collection of slash commands
		slashCommands(client) {
			if (!client.slashCommands) client.slashCommands = new Discord.Collection();
			client.slashCommands.clear();
			for (const file of slashCommandFiles) {
				const slashCommand = require(`./slash-commands/${file}`);
				if (slashCommand.data != undefined) {
					client.slashCommands.set(slashCommand.data.name, slashCommand);
				}
			}
			if (isDev) console.log('Slash Commands Collection Built');
		},
		setvalidCommands(client) {
			for (const entry of client.dotCommands.map(command => command)) {
				config.validCommands.push(entry.name);
				if (Array.isArray(entry.alias)) {
					entry.alias.forEach(element => {
						config.validCommands.push(element);
					});
				} else if (entry.alias != undefined) {
					config.validCommands.push(entry.alias);
				}
			}
			if (isDev) console.log(`Valid Commands Added to Config\n${config.validCommands}`);
		},
		dotCommands(client) {
			if (!client.dotCommands) client.dotCommands = new Discord.Collection();
			client.dotCommands.clear();
			for (const file of dotCommandFiles) {
				const dotCommand = require(`./dot-commands/${file}`);
				client.dotCommands.set(dotCommand.name, dotCommand);
				if (Array.isArray(dotCommand.alias)) {
					dotCommand.alias.forEach(element => {
						client.dotCommands.set(element, dotCommand);
					});
				} else if (dotCommand.alias != undefined) {
					client.dotCommands.set(dotCommand.alias, dotCommand);
				}
			}
			if (isDev) console.log('Dot Commands Collection Built');
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
			if (isDev) console.log('GIFs Collection Built');
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
			if (isDev) console.log('Joints Collection Built');
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
			if (isDev) console.log('Pastas Collection Built');
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
			if (isDev) console.log('Requests Collection Built');
		},
		strains(rows, client) {
			if (!client.strains) client.strains = new Discord.Collection();
			client.strains.clear();
			for (const row of rows) {
				const strain = {
					id: row.id,
					name: row.strain,
				};
				client.strains.set(strain.name, strain);
				// if (isDev) console.log(strain)
			}
			if (isDev) console.log('Strains Collection Built');
		},
		medicalAdvice(rows, client) {
			if (!client.medicalAdviceCol) client.medicalAdviceColl = new Discord.Collection();
			client.medicalAdviceColl.clear();
			for (const row of rows) {
				const medicalAdvice = {
					id: row.id,
					content: row.content
				};
				client.medicalAdviceColl.set(medicalAdvice.id, medicalAdvice);
			}
			if (isDev) console.log('Medical Advice Collection Built');
		},
	},
	dot: {
		getCommandData(message) {
			const commandData = {};
			// Split the message content at the final instance of a period
			const finalPeriod = message.content.lastIndexOf('.');
			if(isDev) console.log(message.content);
			// If the final period is the last character, or doesn't exist
			if (finalPeriod < 0) {
				if (isDev) console.log(finalPeriod);
				commandData.isCommand = false;
				return commandData;
			}
			commandData.isCommand = true;
			// Get the first part of the message, everything leading up to the final period
			commandData.args = message.content.slice(0,finalPeriod).toLowerCase();
			// Get the last part of the message, everything after the final period
			commandData.command = message.content.slice(finalPeriod).replace('.','').toLowerCase();
			commandData.author = `${message.author.username}#${message.author.discriminator}`;
			return this.checkCommand(commandData);
		},
		checkCommand(commandData) {
			if (commandData.isCommand) {
				const validCommands = require('./config.json').validCommands;
				commandData.isValid = validCommands.includes(commandData.command);
				// Add exceptions for messages that contain only a link
				if (commandData.args.startsWith('http')) commandData.isValid = false;
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
			], ephemeral: true };
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

			return { embeds: [pastasEmbed], ephemeral: true };
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

			return { embeds: [requestsEmbed], ephemeral: true };
		},
		strain(strainInfo, interaction) {
			const strainEmbed = new Discord.MessageEmbed()
				.setTimestamp();
			strainEmbed.addFields([
				{
					name: 'Strain Name',
					value: `${strainInfo.strain}`,
					inline: true,
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
					name: 'Flavor',
					value: `${strainInfo.flavor}`,
					inline: true,
				},
				{
					name: 'Rating',
					value: `⭐️${strainInfo.rating}`,
					inline: true,
				},
				{
					name: 'Description',
					value: `${strainInfo.description}`,
					inline: false,
				},
			]);

			interaction.reply({ embeds: [ strainEmbed ]});
		},
		dalle(prompt, imageUrl, size) {
			const dalleEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: "NodBot powered by DALL-E", iconURL: "https://assets.vfsh.dev/openai-logos/PNGs/openai-logomark.png" })
				.addFields(
					{ name: "Prompt", value: prompt }
				)
				.setImage(imageUrl)
				.setFooter({ text: `This ${size} image cost ${strings.costs.dalle[size]}¢ to generate.` })
			return { embeds: [dalleEmbed] };
		},
		gpt(prompt, response, usage) {
			const gptEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: "NodBot powered by GPT-3", iconURL: "https://assets.vfsh.dev/openai-logos/PNGs/openai-logomark.png" })
				.setDescription(`**Prompt**\n${prompt}\n\n**Response**\n${response}`)
				.setFooter({ text: `This prompt used ${usage.tokens} tokens for a cost of ${usage.usdc}¢` })
			return { embeds: [gptEmbed] };
		}
	},
	collect: {
		gifName(interaction) {
			const gifNameFilter = m => m.author.id == strings.temp.gifUserId;
			return interaction.channel.createMessageCollector({ filter: gifNameFilter, time: 30000 });
		},
	},
	upload: {
		request(commandData, client) {
			const query = `INSERT INTO requests (author, request, status) VALUES (${db.escape(commandData.author)},${db.escape(commandData.args)},'Active')`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.requests(client);
			});
		},
		pasta(pastaData, client) {
			const query = `INSERT INTO pastas (name, content) VALUES (${db.escape(pastaData.name)},${db.escape(pastaData.content)})`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.pastas(client);
			});
		},
		joint(content, client) {
			const query = `INSERT INTO joints (content) VALUES (${db.escape(content)})`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.joints(client);
			});
		},
		gif(gifData, client) {
			const query = `INSERT INTO gifs (name, embed_url) VALUES (${db.escape(gifData.name)}, ${db.escape(gifData.embed_url)})`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.gifs(client);
			});
		},
		setup(interaction) {
			/* Tables:
			 *	- gifs
			 *	- joints
			 *	- pastas
			 *	- requests
			 *	- strains */
			const gifsQuery = "CREATE TABLE 'gifs' (id int(11), name varchar(100), embed_url varchar(1000), PRIMARY KEY(id))";
			const jointsQuery = "CREATE TABLE 'joints' (id int(11), content varchar(1000), PRIMARY KEY(id))";
			const pastasQuery = "CREATE TABLE 'pastas' (id int(11), name varchar(100), content varchar(1900), iconurl varchar(200) DEFAULT 'https://cdn.discordapp.com/avatars/513184762073055252/12227aa23a06d5178853e59b72c7487b.webp?size=128', PRIMARY KEY(id))";
			const requestsQuery = "CREATE TABLE 'requests' (id int(11), author varchar(100), request varchar(1000), status varchar(10) DEFAULT 'Active', PRIMARY KEY(id))";
			const strainsQuery = "CREATE TABLE 'strains' (id smallint(6), name varchar(60), type varchar(10), effects varchat(80), ailment varchar(70), flavor varchar(30), PRIMARY KEY(id))";

			// Check for owner
			if (interaction.user.id == ownerId) {
				db.query(gifsQuery, (err, rows, fields) => {
					if (err) throw err;
				});
				db.query(jointsQuery, (err, rows, fields) => {
					if (err) throw err;
				});
				db.query(pastasQuery, (err, rows, fields) => {
					if (err) throw err;
				});
				db.query(requestsQuery, (err, rows, fields) => {
					if (err) throw err;
				});
				db.query(strainsQuery, (err, rows, fields) => {
					if (err) throw err;
				});
				return 'I\'ve created the required tables. Please check your database to validate this.';
			} else {
				return 'Sorry, you don\'t have permission to do that.';
			}
		},
		medicalAdvice(content, client) {
			const query = `INSERT INTO medical_advice (content) VALUES (${db.escape(content)})`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.medicalAdvice(client);
			});
		},
		strain(interaction) {
			const strain = db.escape(interaction.options.getString('name'));
			const type = db.escape(interaction.options.getString('type'));
			const effects = db.escape(( interaction.options.getString('effects') || 'Unkown' ));
			const description = db.escape(( interaction.options.getString('description') || 'Unknown' ));
			const flavor = db.escape(( interaction.options.getString('flavor') || 'Unknown' ));
			const rating = db.escape(( interaction.options.getString('rating') || '3' ));
			const strainQuery = `INSERT INTO strains (strain, type, effects, description, flavor, rating) VALUES (${strain}, ${type}, ${effects}, ${description}, ${flavor}, ${rating})`;
			console.log(strainQuery);
			return new Promise((resolve, reject) => {
				db.query(strainQuery, (err, rows, fields) => {
					if (err) reject(err);
					functions.download.strains(interaction.client);
					resolve();
				});
			})
		},
		openai(user, prompt, engine, tokens, usdc) {
			const query = `INSERT INTO openai (user, prompt, engine, tokens, usdc) VALUES (${db.escape(user)}, ${db.escape(prompt)}, ${db.escape(engine)}, ${db.escape(tokens)}, ${db.escape(usdc)})`;
			db.query(query, (err) => {
				if (err) throw err;
			});
		}
	},
	download: {
		requests(client) {
			const query = 'SELECT * FROM requests WHERE status = \'Active\' ORDER BY id DESC';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.requests(rows, client);
			});
		},
		pastas(client) {
			const query = 'SELECT * FROM pastas ORDER BY id ASC';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.pastas(rows, client);
			});
		},
		gifs(client) {
			const query = 'SELECT * FROM gifs ORDER BY id ASC';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.gifs(rows, client);
			});
		},
		joints(client) {
			const query = 'SELECT * FROM joints ORDER BY id ASC';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.joints(rows, client);
			});
		},
		strain(strainName, interaction) {
			const query = `SELECT id, strain, type, effects, description, flavor, rating FROM strains WHERE strain = ${db.escape(strainName)}`;
			db.query(query, (err, rows, fields) => {
				if (rows != undefined) {
					const strainInfo = {
						id: `${rows[0].id}`,
						strain: `${rows[0].strain}`,
						type: `${rows[0].type}`,
						effects: `${rows[0].effects}`,
						description: `${rows[0].description}`,
						flavor: `${rows[0].flavor}`,
						rating: `${rows[0].rating}`,
					};
					functions.embeds.strain(strainInfo, interaction);
				}
			});
		},
		strains(client) {
			const query = 'SELECT id, strain FROM strains';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.strains(rows, client);
			});
		},
		medicalAdvice(client) {
			const query = 'SELECT * FROM medical_advice ORDER BY id ASC';
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.collections.medicalAdvice(rows, client);
			});
		}
	},
	weed: {
		strain: {
			lookup(strainName, client) {
				const strainSearcher = new FuzzySearch(client.strains.map(e => e.name));
				return strainSearcher.search(strainName).slice(0,25);
			},
			submit(strainName) {
				const query = ``
				return strainName;
			}
		}
	},
	openAI: {
		chatPrompt(userPrompt) {
			return new Promise(async (resolve, reject) => {
				const response = await openai.createCompletion({
					model: 'text-davinci-003',
					prompt: userPrompt,
					temperature: 0.7,
					max_tokens: 250
				}).catch(e => {
					reject(e);
					return null;
				});
				resolve(response.data);
			});
		},
		imagePrompt(userPrompt, size, userId) {
			return new Promise(async (resolve, reject) => {
				try {
					const response = await openai.createImage({
						prompt: userPrompt,
						size: size,
						user: userId
					});
					resolve(response.data.data[0].url);
				} catch (e) {
					reject(e);
					return;
				}
			});
		}
	},
	// Parent-Level functions (miscellaneuous)
	closeRequest(requestId, interaction) {
		if (interaction.user.id == ownerId) {
			const { client } = interaction;
			const query = `UPDATE requests SET status = 'Closed' WHERE id = ${db.escape(requestId)}`;
			db.query(query, (err, rows, fields) => {
				if (err) throw err;
				functions.download.requests(client);
			});
			interaction.reply({ content: `Request #${requestId} has been closed.`, ephemeral: true });
		} else {
			interaction.reply({ content: 'You do not have permission to do that.', ephemeral: true });
		}
		if (isDev) {
			console.log(requestId, interaction, ownerId);
		}
	},
	spongebob(commandData) {
		let newText = '';
		for (const letter of commandData.args) {
			if (letter == ' ') {
				newText += letter;
				continue;
			}
			if (letter == 'i' || letter == 'I') {
				newText += 'i';
				continue;
			}
			if (letter == 'l' || letter == 'L') {
				newText += 'L';
				continue;
			}
			if (Math.random() > 0.5) {
				newText += letter.toUpperCase();
			} else {
				newText += letter.toLowerCase();
			}
		}

		return newText + ' <:spongebob:1053398825965985822>';
	},
	generateErrorId() {
		const digitCount = 10;
		const digits = [];
		for (let i = 0; i < digitCount; i++) {
			const randBase = Math.random();
			const randNumRaw = randBase * 10;
			const randNumRound = Math.floor(randNumRaw);
			digits.push(randNumRound);
		}
		const errorId = digits.join("");
		return errorId;
	}
};

module.exports = functions;