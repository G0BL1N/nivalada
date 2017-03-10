const {RichEmbed} = require('discord.js');
const {booruRequestRecursive} = require('../../utilities.js');

module.exports = {
  variants: ['safebooru'],
  description: 'Поиск по safebooru.org.',
  usage: 'safebooru animal_ears',
  async action(message, args) {

    let channel = message.channel;
    let pending = channel.send('Поиск...')
      .then((message) => {
        return message;
      });
    args.replace(/\s/g, '+');
    let query = encodeURIComponent(args);
    let url = 'https://safebooru.org/index.php?page=dapi&s=post&q=index' +
    `&json=1&limit=100&tags=${query}`;
    booruRequestRecursive(url, [], 0)
      .then((list) => {
        pending.then((message) => {
          let {image, directory} = list[Math.floor(Math.random() * list.length)]
          let url = `https://safebooru.org/images/${directory}/${image}`;
          let embed = new RichEmbed()
            .setColor(0xa5c7ff)
            .setImage(url);
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
