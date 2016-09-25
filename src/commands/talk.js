const config = require('../../config.json');
const Client = require('../main.js').Client;
const prefix = config.prefix;

const category = {
  name: 'talk',
  commands: [
    {
			prefix: '',
			variants: ['/o/'],
			description: '/o/ \\o\\ /o/ \\o\\',
			usage: '/o/',
			action: (message) => {
				message.channel.sendMessage('\\o\\');
			}
		},
    {
			prefix: '',
			variants: ['\\o\\'],
			description: '\\o\\ /o/ \\o\\ /o/',
			usage: '\\o\\',
			action: (message) => {
				message.channel.sendMessage('/o/');
			}
		},
  ],
}
module.exports = category;
