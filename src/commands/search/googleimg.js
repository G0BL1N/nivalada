const {RichEmbed} = require('discord.js');
const request = require('request-promise-native');
const config = require('../../../config.json');

module.exports = {
    variants: ['googleimg','gi'],
    description: 'Производит поиск по указанному запросу в Google и возвращает картинку.',
    usage: 'gi котик',
    async action(message, args) {
      let channel = message.channel;
      let pending = channel.send('Поиск...')
        .then((message) => {
          return message;
        });
      let query = encodeURIComponent(args);
      let url = 'https://www.googleapis.com/customsearch/v1' +
      `?key=${config.googlekey}&cx=${config.googlecsid}&q=${query}`;
      url += '&searchType=image';
      request(url)
        .then((body) => {
          let parsed = JSON.parse(body);
          if(parsed.items && parsed.items.length > 0)
            pending.then(message => {
              let embed = new RichEmbed()
                .setColor(0xfbbc05)
                .setImage(parsed.items[0].link);
              message.edit('',{embed: embed});
            });
          else
            pending.then(message => message.edit(':x: Не найдено.'));
        })
        .catch(() => {
          pending.then(message => message.edit(':x: Ошибка.'));
        });
    }
  }
