const config = require('../../config.json');
const Client = require('../main.js').Client;
const handler = require('../command_handler.js');
const prefix = config.prefix;

module.exports = {
  name: 'info',
  commands: [
    {
      prefix: prefix,
      variants: ['help', 'h'],
      description: 'Помощь по категории или команде',
      usage: prefix+'help info',
      action(message) {
        let content = message.content;
        let index = content.indexOf(' ')+1;
        if(index === -1) {
          //help message
          return;
        }
        let query = content.substr(index);
        let cat = handler.findCategory(query);
        if(cat) {
          let reply = `Команды категории \`${cat.name}\`:\n`;
          for(let cmd of cat.commands) {
            reply = reply +`• \`${cmd.variants[0]}\`\n`;
          }
          message.channel.sendMessage(reply);
          return;
        }
        let cmd = handler.findCommand(query) || handler.findCommandPrefix(query);
        if(cmd) {
          let reply =  `Помощь по команде \`${cmd.variants[0]}\`:\n` +
          `**Описание**: ${cmd.description}\n**Использование**: ${cmd.usage}` +
          '\n**Варианты** :';
          for(let variant of cmd.variants) {
            reply = reply + `\`${variant}\`,`;
          }
          reply = reply.substr(0, reply.length - 1);
          message.channel.sendMessage(reply);
          return;
        }
      }
    },
    {
			prefix: prefix,
			variants: ['uptime', 'up', 'аптайм'],
			description: 'Показывает аптайм.',
			usage: prefix+'uptime',
			action(message) {
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
    {
      prefix: prefix,
      variants: ['userid', 'uid'],
      description: 'Выводит id указанных пользователей.',
      usage: prefix+'userid @Man @Dude @Bot',
      action(message) {
        let users = message.mentions.users.array();
        let reply = '';
        let bLen = 0;
        for(let user of users) {
          let name = user.username;
          if(name.length > bLen) bLen = name.length;
        }
        for(let user of users) {
          let name = user.username;
          reply = reply + `**${name}**` +
          String.fromCharCode(8196).repeat(bLen - name.length) + //spaces
          ` – <${user.id}>\n`;
        }
        message.channel.sendMessage(reply);
      }
    },
    {
      prefix: prefix,
      variants: ['getavatar', 'avatar'],
      description: 'Выводит ссылку на аватар указанного пользователей.',
      usage: prefix+'getavatar @Dude',
      action(message) {
        let user = message.mentions.users.first();
        message.channel.sendMessage(user.avatarURL);
      }
    },
  ],
}
