const Client = require('../main.js');
const logger = require('./logger.js');
const request = require('request');
const fs = require('fs');

const prefix = Client.config.prefix;

module.exports = {
  name: ':keyboard: Управление',
  commands: [
    {
      prefix: prefix,
      variants: ['setavatar', 'newavatar'],
      description: 'Устанавливает в качестве нового аватара файл по ссылке.',
      usage: prefix + 'setavatar http://examplesiteitsnotreal.com/avatar.png',
      permissions: ['OWNER'],
      async action(message, args) {
        let url = args;

        request({uri: url, encoding: null}, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            Client.user.setAvatar(body);
            logger.log('New avatar set.');
            message.channel.sendMessage('Новый аватар установлен.');
          } else {
            //do something
          }
        });
      }
    },
    {
      prefix: prefix,
      variants: ['stop', 'reboot'],
      description: 'Выключает бота. Если был запущен через forever то будет перезагружен.',
      usage: prefix + 'stop',
      permissions: ['TRUSTED'],
      async action(message, args) {
        process.exit();
      }
    },
  ],
}
