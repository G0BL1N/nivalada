const config = require('../../config.json');
const Client = require('../main.js').Client;
const youtube = require('../youtube.js');
const request = require('request');
const prefix = config.prefix;

module.exports = {
  name: 'search',
  commands: [
    {
      prefix: prefix,
      variants: ['yt','youtube'],
      description: 'Ищет видео на YouTube и возвращает ссылку на видео.',
      usage: prefix + '',
      action(message) {
        let content = message.content;
        let query = content.substr(content.indexOf(' ')+1);
        youtube.search(query).then((result) => {
          let url = `https://www.youtube.com/watch?v=${result.id.videoId}`;
          message.channel.sendMessage(url);
        });
      }
    },
  ],
}
