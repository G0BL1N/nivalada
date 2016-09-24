const config = require('../../config.json');
const main = require('../main.js');
const Client = main.Client;
const Queues = main.Queues;
const prefix = config.prefix;

const category = {
  name: 'music',
  commands: [
    {
			prefix: prefix,
			variants: ['mv', 'move'],
			description: 'Перемещает бота на ваш голосовой канал.',
			usage: prefix+'mv',
			action(message) {
        if(message.member.voiceChannel) {
          Queues.get(message.guild.id).move(message.member.voiceChannel);
        }
			}
		},
    {
      prefix: prefix,
      variants: ['add', 'q'],
      description: 'Добавляет трек в очередь, допустимы' +
      ' ссылки на Youtube, ~~ссылки на аудио-стримы~~ или название.',
      usage: 'usage',
      action(message) {
          let queue = Queues.get(message.guild.id);
          queue.setTextChannel(message.channel);
          if(!queue.connection) {
            if(message.member.voiceChannel) {
              queue.move(message.member.voiceChannel);
            } else {
              //do warning
              return;
            }
          }
          let content = message.content;
          let query = content.substr(content.indexOf(' ')+1); //needs to be redone
          queue.push(query);
      }
    },
    {
      prefix: prefix,
      variants: ['vol', 'v'],
      description: 'Устанавливает громкость музыки для этого сервера.',
      usage: prefix+'v 45',
      action(message) {
        let content = message.content;
        let vol = content.substr(content.indexOf(' ')+1);
        Queues.get(message.guild.id).setVol(vol);
      }
    },
  ],
}
module.exports = category;
