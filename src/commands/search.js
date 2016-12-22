const Client = require('../main.js');
const request = require('request-promise-native');
const querystring = require('querystring');

const config = Client.config;
const prefix = Client.config.prefix;
module.exports = {
  name: ':mag: Поиск',
  commands: [
    {
      prefix: prefix,
      variants: ['yt','youtube'],
      description: 'Ищет видео на YouTube и возвращает ссылку на видео.',
      usage: prefix + 'yt смешнявки',
      async action(message, args) {
        let query = args;
        youtube.search(query).then((result) => {
          let url = `https://www.youtube.com/watch?v=${result.id.videoId}`;
          message.channel.sendMessage(url);
        });
      }
    },
    {
      prefix: prefix,
      variants: ['google','gg'],
      description: 'Производит поиск по указанному запросу в Google и возвращает результат.',
      usage: prefix + 'yt смешнявки',
      async action(message, args) {
        let channel = message.channel;
        channel.startTyping();
        let pending = channel.sendMessage('Поиск...')

        let query = querystring.escape(args);
        let url = 'https://www.googleapis.com/customsearch/v1' +
        `?key=${config.googlekey}&cx=${config.googlecsid}&q=${query}`;
        request(url)
          .then((body) => {
            let parsed = JSON.parse(body);
            if(parsed.items && parsed.items[0])
              pending.then(message => message.edit(parsed.items[0].link));
            else
              pending.then(message => message.edit(':x: Не найдено.'));
            channel.stopTyping();
          })
          .catch((err) => {
            pending.then(message => message.edit(':x: Ошибка.'));
            channel.stopTyping();
          });
      }
    },
  ],
}
