const {RichEmbed} = require('discord.js');
const request = require('request-promise-native');

const config = require('../../config.json');
const prefix = config.prefix;
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
          message.channel.send(url);
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
    },
    {
      prefix: prefix,
      variants: ['googleimg','gi'],
      description: 'Производит поиск по указанному запросу в Google и возвращает картинку.',
      usage: prefix + 'yt котик',
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
    },
    {
      prefix: prefix,
      variants: ['safebooru'],
      description: 'Поиск по safebooru.org.',
      usage: prefix + 'safebooru animal_ears',
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
    },
  ],
};
