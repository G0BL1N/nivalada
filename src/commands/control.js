const config = require('../../config.json');
const Client = require('../main.js');
const request = require('request');
const fs = require('fs');
const prefix = config.prefix;

module.exports = {
  name: 'control',
  commands: [
    {
      prefix: prefix,
      variants: ['setavatar', 'newavatar'],
      description: 'Устанавливает в качестве нового аватара файл по ссылке.',
      usage: prefix + 'setavatar http://examplesiteitsnotreal.com/avatar.png',
      permissions: ['OWNER'],
      action(message) {

        let content = message.content;
        let url = content.substr(content.indexOf(' ')+1);

        request({uri: url, encoding: null}, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            Client.user.setAvatar(body);
            console.log('New avatar set.');
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
      action(message) {
        process.exit();
      }
    },
  ],
}
