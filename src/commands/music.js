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
      description: 'Ищет трек на Youtube и добавляет в очередь, допустимы' +
      ' ссылки на Youtube или название.',
      usage: prefix + 'q rickroll',
      action(message) {
          let queue = Queues.get(message.guild.id);
          queue.setTextChannel(message.channel);
          if(!queue.connection) {
            if(message.member.voiceChannel) {
              queue.move(message.member.voiceChannel)
              .then(() => {
                let content = message.content;
                let query = content.substr(content.indexOf(' ')+1);
                queue.push(query);
              });
              return;
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
      variants: ['addstream', 'qs'],
      description: 'Добавляет аудиострим в очередь.',
      usage: prefix + 'qs http://examplesiteitsnotreal.com/stream',
      action(message) {
          let queue = Queues.get(message.guild.id);
          queue.setTextChannel(message.channel);
          if(!queue.connection) {
            if(message.member.voiceChannel) {
              queue.move(message.member.voiceChannel)
              .then(() => {
                let content = message.content;
                let query = content.substr(content.indexOf(' ')+1);
                queue.pushStream(query);
              });
              return;
            } else {
              //do warning
              return;
            }
          }
          let content = message.content;
          let query = content.substr(content.indexOf(' ')+1);
          queue.pushStream(query);
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
      variants: ['rm', 'remove'],
      description: 'Бот удаляет указанный трек из очереди' +
      ' или очищает всю очередь если ничего указано не было.',
      usage: prefix+'rm 2',
      action(message) {
        let content = message.content;
        let num = parseInt(content.substr(content.indexOf(' ')+1));
        Queues.get(message.guild.id).remove(num ? num + 1 : null);
      }
    },
    {
      prefix: prefix,
      variants: ['lv', 'leave'],
      description: 'Бот покидает голосовй канал и очищает очередь.',
      usage: prefix+'list',
      action(message) {
        Queues.get(message.guild.id).leave();
      }
    },
  ],
}
