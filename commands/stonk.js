var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://yahoo-finance-low-latency.p.rapidapi.com/v6/finance/quote',
  params: {symbols: ''},
  headers: {
    'x-rapidapi-key': '0b3f85bcb7msh1e6e80e963c9914p1d1934jsnc3542fc83520',
    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
  }
};

module.exports = {
	name: 'stonk',
	description: 'Get stonk details from Yahoo Finance',
	execute(message, file) {
		options.params.symbols = file.name;
		axios.request(options).then(function (response) {
			
		}).catch(function (error) {
			console.error(error);
		});
	}
}