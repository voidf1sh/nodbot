const Discord = require('discord.js');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const gifFiles = fs.readdirSync('./gifs').filter(file => file.endsWith('.js'));
const pastaFiles = fs.readdirSync('./pastas').filter(file => file.endsWith('.js'));

module.exports = {
	getCommandFiles(client) {
		client.commands = new Discord.Collection();
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
	},
	getGifFiles(client) {
		client.gifs = new Discord.Collection();
		for (const file of gifFiles) {
			const gif = require(`./gifs/${file}`);
			client.gifs.set(gif.name, gif);
		}
	},
	getPastaFiles(client) {
		client.pastas = new Discord.Collection();
		for (const file of pastaFiles) {
			const pasta = require(`./pastas/${file}`);
			client.pastas.set(pasta.name, pasta);
		}
	},
	getFileInfo(content) {
		// const finalPeriod = content.search(/\.(?:.(?!\\))+$/gim);
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
	cleanInput(input) {
		return input.replace(/'/g, '\\\'').replace(/\n/g, '\\n');
	},
	createGifEmbed(data, author, command) {
		return new Discord.MessageEmbed()
			.setAuthor(command)
			.setImage(data.embed_url)
			.setTimestamp()
			.setFooter(`@${author.username}#${author.discriminator}`);
	},
	saveGif(message, name, embed_url) {
		fs.writeFile(`./gifs/${name}.js`, `module.exports = {\n\tname: '${name}',\n\tembed_url: '${embed_url}'\n}`, function(err) {
			if (err) throw err;
			console.log('Saved file!');
			const gif = require(`./gifs/${name}.js`);
			message.client.gifs.set(gif.name, gif);
		});
	},
	savePasta(message, name, content) {
		fs.writeFile(`./pastas/${name}.js`, `module.exports = {\n\tname: '${name}',\n\tcontent: '${content}'\n}`, function(err) {
			if (err) {
				return `There was a problem saving the copypasta.`;
			}
			const pasta = require(`./pastas/${name}.js`);
			message.client.pastas.set(pasta.name, pasta);
		});
		return `Copypasta saved successfully as ${name}.pasta`;
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
	}
}