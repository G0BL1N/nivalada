const config = require('../../config.json');
const Client = require('../main.js');
const voiceHandler = require('../voiceHandler.js');
const audioHandler = require('../audioHandler.js');
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
        let id = message.guild.id;
        voiceHandler[id].move(message.member.voiceChannel);
      }
    },
    {
      prefix: prefix,
      variants: ['add', 'q'],
      description: 'Ищет трек на Youtube и добавляет в очередь, допустимы' +
      ' ссылки на Youtube или название.',
      usage: prefix + 'q rickroll',
      action(message) {
        let content = message.content;
        let query = content.substr(content.indexOf(' ')+1);
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.connect(message.member)
        .then(() => queue.add(query, message.author));
      }
    },
    {
      prefix: prefix,
      variants: ['addstream', 'qs'],
      description: 'Добавляет аудиострим в очередь.',
      usage: prefix + 'qs http://examplesiteitsnotreal.com/stream',
      action(message) {
        let content = message.content;
        let query = content.substr(content.indexOf(' ')+1);
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.connect(message.member)
        .then(() => queue.addStream(query, message.author));
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
        voiceHandler[message.guild.id].setVolume(vol);
      }
    },
    {
      prefix: prefix,
      variants: ['skip', 'next','s','n'],
      description: 'Бот пропускает текущий трек.',
      usage: prefix+'skip',
      action(message) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.skip();
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
        voiceHandler[message.guild.id].remove(num ? num - 1 : null);
        message.channel.sendMessage(':white_check_mark: Очередь очищена.');
      }
    },
    {
      prefix: prefix,
      variants: ['lv', 'leave'],
      description: 'Бот покидает голосовой канал и очищает очередь.',
      usage: prefix+'leave',
      action(message) {
        voiceHandler[message.guild.id].leave();
      }
    },
    {
      prefix: prefix,
      variants: ['ls', 'list'],
      description: 'Список треков в очереди.',
      usage: prefix+'list',
      action(message) {
        voiceHandler[message.guild.id].list();
      }
    },
    {
      prefix: prefix,
      variants: ['shuffle', 'shu'],
      description: 'Перемешивает очередь.',
      usage: prefix+'shu',
      action(message) {
        voiceHandler[message.guild.id].shuffle();
        let channel = message.channel;
        channel.sendMessage(':twisted_rightwards_arrows: Очередь перемешана.');
      }
    },
  ],
}
