const request = require('request-promise-native');
const config = require('../../../config.json');

module.exports = {
  variants: ['google','gg'],
  description: 'Производит поиск по указанному запросу в Google и возвращает результат.',
  usage: 'yt смешнявки',
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
    request(url)
      .then((body) => {
        let parsed = JSON.parse(body);
        if(parsed.items && parsed.items.length > 0)
          pending.then(message => message.edit(parsed.items[0].link));
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
