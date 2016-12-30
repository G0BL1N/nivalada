const {RichEmbed} = require('discord.js');

module.exports = {
    variants: ['googleimg','gi'],
    description: 'Производит поиск по указанному запросу в Google и возвращает картинку.',
    usage: 'gi котик',
    async action(message, args) {
      let channel = message.channel;
      let pending = channel.send('Поиск...')
        .then((message) => {
          channel.startTyping()
          return message;
        });
      let query = encodeURIComponent(args);
      let url = 'https://www.googleapis.com/customsearch/v1' +
      `?key=${config.googlekey}&cx=${config.googlecsid}&q=${query}`;
      url += '&searchType=image';
      console.log(url);
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
          channel.stopTyping();
        })
        .catch(() => {
          pending.then(message => message.edit(':x: Ошибка.'));
          channel.stopTyping();
        });
    }
  }
