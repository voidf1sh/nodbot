const axios = require("axios").default;
const functions = require('../functions.js');

let options = {
  method: 'GET',
  url: 'https://forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com/get_airport_by_iata',
  params: {auth: 'authairport567', airport_id: 'LAX'},
  headers: {
    'x-rapidapi-key': '0b3f85bcb7msh1e6e80e963c9914p1d1934jsnc3542fc83520',
    'x-rapidapi-host': 'forteweb-airportguide-airport-basic-info-v1.p.rapidapi.com'
  }
};

module.exports = {
	name: 'airport',
	description: 'Get airport information by IATA code.',
	execute(message, file) {
		options.params.airport_id = file.name;
		axios.request(options).then(function (response) {
			const embed = functions.createAirportEmbed(response.data, message.author, `${file.name}.${file.extension}`);
			message.channel.send(embed).then().catch(err => console.error(err));
		}).catch(function (error) {
			console.error(error);
		});		
	}
}