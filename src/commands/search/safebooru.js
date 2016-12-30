const {RichEmbed} = require('discord.js');

module.exports = {
  variants: ['safebooru'],
  description: 'Поиск по safebooru.org.',
  usage: 'safebooru animal_ears',
  async action(message, args) {

    let channel = message.channel;
    let pending = channel.send('Поиск...')
      .then((message) => {
        channel.startTyping()
        return message;
      });
    args.replace(/\s/g, '+');
    let query = encodeURIComponent(args);
    let url = 'https://safebooru.org/index.php?page=dapi&s=post&q=index' +
    `&json=1&limit=100&tags=${query}`;
    requestNext(url, [], 0)
      .then((list) => {
        pending.then((message) => {
          channel.stopTyping();
          let {image, directory} = list[Math.floor(Math.random() * list.length)]
          let url = `https://safebooru.org/images/${directory}/${image}`;
          let embed = new RichEmbed()
            .setColor(0xa5c7ff)
            .setImage(url);
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
