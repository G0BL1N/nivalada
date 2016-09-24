const config = require('../../config.json');
const Client = require('../main.js').Client;
const prefix = config.prefix;

const category = {
  name: 'info',
  commands: [
    {
			prefix: prefix,
			variants: ['uptime', 'up', 'аптайм'],
			description: 'Показывает аптайм.',
			usage: prefix+'uptime',
			action: (message) => {
				let ms = Client.uptime;
				let days      = Math.floor(ms / (24*60*60*1000));
				let daysms    = ms % (24*60*60*1000);
				let hours     = Math.floor((daysms)/(60*60*1000));
				let hoursms   = ms % (60*60*1000);
				let minutes   = Math.floor((hoursms)/(60*1000));
				let minutesms = ms % (60*1000);
				let sec = Math.floor((minutesms)/(1000));
				message.channel.sendMessage(`Онлайн: \`${days}\` дней, `+
					`\`${hours}\` часов, \`${minutes}\` минут, \`${sec}\` секунд.`);
			}
		},
  ],
}
module.exports = category;
