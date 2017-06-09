const {RichEmbed} = require('discord.js');
const {booruRequestRecursive} = require('../../utilities.js');

module.exports = {
  variants: ['gelbooru'],
  description: 'Поиск по gelbooru.com.',
  usage: 'gelbooru animal_ears',
  async action(message, args) {

    let channel = message.channel;
    let pending = channel.send('Поиск...')
      .then((message) => {
        return message;
      });
    if(!channel.nsfw)
      args += ' rating:safe';
    args.replace(/\s/g, '+');
    let query = encodeURIComponent(args);

    let url = 'http://gelbooru.com/index.php?page=dapi&s=post&q=index' +
    `&json=1&limit=100&tags=${query}`;
    booruRequestRecursive(url, [], 0)
      .then((list) => {
        pending.then((message) => {
          let {file_url} = list[Math.floor(Math.random() * list.length)];
          file_url = 'http:' + file_url;
          let embed = new RichEmbed()
            .setColor(0xa5c7ff)
            .setImage(file_url);
          message.edit('', {embed: embed});
        })
      })
      .catch((err) => {
        if(err.message === 'Not found') {
          pending.then(message => message.edit(':x: Не найдено.'));
        } else {
          pending.then(message => message.edit(':x: Ошибка.'));
        }
      });

  }
}
