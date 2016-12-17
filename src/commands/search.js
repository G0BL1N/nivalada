const request = require('request');
const querystring = require('querystring');

const config = require('../../config.json');
const Client = require('../main.js');
//const youtube = require('../youtube.js');
const prefix = config.prefix;

module.exports = {
  name: 'search',
  commands: [
    {
      prefix: prefix,
      variants: ['yt','youtube'],
      description: 'Ищет видео на YouTube и возвращает ссылку на видео.',
      usage: prefix + 'yt смешнявки',
      action(message) {
        let content = message.content;
        let query = content.substr(content.indexOf(' ')+1);
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
      action(message) {
        message.channel.sendMessage('Поиск...').then((reply) => {
          let content = message.content;
          let query = content.substr(content.indexOf(' ')+1);
          query = querystring.escape(query);
          let url = 'https://www.googleapis.com/customsearch/v1' +
          `?key=${config.googlekey}&cx=${config.googlecsid}&q=${query}`;
          request(url, (error, response, body) => {
            let parsed = JSON.parse(body);
            if (!error && response.statusCode == 200
              && parsed.items && parsed.items[0]) {
              reply.edit(parsed.items[0].link);
            } else reply.edit('Не найдено.');
          });
        });
      }
    },
  ],
}
