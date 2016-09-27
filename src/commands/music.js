const config = require('../../config.json');
const main = require('../main.js');
const Client = main.Client;
const Queues = main.Queues;
const prefix = config.prefix;

module.exports = {
  name: 'music',
  commands: [
    {
			prefix: prefix,
			variants: ['mv', 'move'],
			description: 'Перемещает бота на ваш голосовой канал.',
			usage: prefix+'mv',
			action(message) {
        if(!message.member.voiceChannel) return;
        Queues.get(message.guild.id).move(message.member.voiceChannel);
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
          let query = content.substr(content.indexOf(' ')+1);
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
        let queue = Queues.get(message.guild.id);
        queue.setTextChannel(message.channel);
        queue.setVol(vol);
      }
    },
    {
      prefix: prefix,
      variants: ['skip', 'next','s','n'],
      description: 'Бот пропускает текущий трек.',
      usage: prefix+'skip',
      action(message) {
        let queue = Queues.get(message.guild.id);
        queue.setTextChannel(message.channel);
        queue.skip();
      }
    },
    {
      prefix: prefix,
      variants: ['ls', 'list'],
      description: 'Бот выдёт список треков в очереди.',
      usage: prefix+'list',
      action(message) {
        let queue = Queues.get(message.guild.id);
        queue.setTextChannel(message.channel);
        queue.list();
      }
    },
    {
      prefix: prefix,
      variants: ['lv', 'leave'],
      description: 'Бот покидает голосовй канал.',
      usage: prefix+'list',
      action(message) {
        Queues.get(message.guild.id).leave();
      }
    },
  ],
}
