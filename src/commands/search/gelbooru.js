const {RichEmbed} = require('discord.js');
const request = require('request-promise-native');

module.exports = {
  variants: ['gelbooru'],
  description: 'Поиск по gelbooru.com.',
  usage: 'gelbooru animal_ears',
  async action(message, args) {

    let channel = message.channel;
    let pending = channel.send('Поиск...')
      .then((message) => {
        channel.startTyping()
        return message;
      });
    args += ' rating:safe';
    args.replace(/\s/g, '+');
    let query = encodeURIComponent(args);

    let url = 'http://gelbooru.com/index.php?page=dapi&s=post&q=index' +
    `&json=1&limit=100&tags=${query}`;
    requestNext(url, [], 0)
      .then((list) => {
        pending.then((message) => {
          channel.stopTyping();
          let {file_url} = list[Math.floor(Math.random() * list.length)]
          let embed = new RichEmbed()
            .setColor(0xa5c7ff)
            .setImage(file_url);
          message.edit('',{embed: embed});
        })
      });
    function requestNext(url, list, currPage) {
      url += `&pid=${currPage}`;
      return request(url)
        .then((body) => {
          let content = JSON.parse(body);
          list = list.concat(content);
          if(content.length < 100 || list.length === 1000) return list;
          return requestNext(url, list, ++currPage);
        })
    }
  }
}
