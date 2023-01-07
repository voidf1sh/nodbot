const fn = require('../functions.js');
// const { emoji } = require('../strings.json');

module.exports = {
	name: 'md',
	description: 'Get some medical advice.',
	usage: '.md',
	execute(message, commandData) {
		let medicalAdviceArr = [];
		for (const entry of message.client.medicalAdviceColl.map(medicalAdvice => medicalAdvice.content)) {
			medicalAdviceArr.push(entry);
		}
		const randIndex = Math.floor(Math.random() * medicalAdviceArr.length);
		message.reply(`${medicalAdviceArr[randIndex]}`);
	}
}