const voiceHandler = require('../voiceHandler.js');
const {prefix} = require('../../config.json');

module.exports = {
  name: ':notes: Музыка',
  commands: [
    {
      prefix: prefix,
      variants: ['mv', 'move'],
      description: 'Перемещает бота на ваш голосовой канал.',
      usage: prefix + 'mv',
      async action(message) {
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
      async action(message, args) {
        let queue = voiceHandler[message.guild.id];

        queue.setTextChannel(message.channel);
        queue.connect(message.member)
        .then(() => queue.add(args, message.author));
      }
    },
    {
      prefix: prefix,
      variants: ['addstream', 'qs'],
      description: 'Добавляет аудиострим в очередь.',
      usage: prefix + 'qs http://examplesiteitsnotreal.com/stream',
      async action(message, args) {
        let queue = voiceHandler[message.guild.id];

        queue.setTextChannel(message.channel);
        queue.connect(message.member)
        .then(() => queue.addStream(args, message.author));
      }
    },
    {
      prefix: prefix,
      variants: ['vol', 'v'],
      description: 'Устанавливает громкость музыки для этого сервера.',
      usage: prefix + 'v 45',
      async action(message, args) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        voiceHandler[message.guild.id].setVolume(args);
      }
    },
    {
      prefix: prefix,
      variants: ['skip', 'next', 's', 'n'],
      description: 'Бот пропускает текущий трек.',
      usage: prefix + 'skip',
      async action(message) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.skip();
      }
    },
    {
      prefix: prefix,
      variants: ['rm', 'remove'],
      description: 'Бот удаляет указанный трек из очереди' +
      ' или очищает всю очередь если было указано \`all\`.',
      usage: prefix + 'rm 2',
      async action(message, args) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        if(args === 'all') {
          queue.removeAll();
          message.channel.send(':white_check_mark: Очередь очищена.');
          return;
        }
        let num = parseInt(args);
        if(!num) return;
        queue.remove(num);
      }
    },
    {
      prefix: prefix,
      variants: ['lv', 'leave'],
      description: 'Бот покидает голосовой канал и очищает очередь.',
      usage: prefix + 'leave',
      async action(message) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.leave();
      }
    },
    {
      prefix: prefix,
      variants: ['ls', 'list'],
      description: 'Список треков в очереди.',
      usage: prefix + 'list',
      async action(message) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.list();
      }
    },
    {
      prefix: prefix,
      variants: ['shuffle', 'shu'],
      description: 'Перемешивает очередь.',
      usage: prefix + 'shu',
      async action(message) {
        let queue = voiceHandler[message.guild.id];
        queue.setTextChannel(message.channel);
        queue.shuffle();
        let channel = message.channel;
        channel.send(':twisted_rightwards_arrows: Очередь перемешана.');
      }
    },
  ],
}
