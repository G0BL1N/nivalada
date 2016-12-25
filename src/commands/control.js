const exec = require('child_process').exec;
const logger = require('../logger.js');
const {prefix} = require('../../config.json');

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
        message.client.user.setAvatar(url)
          .catch((err) => {
            logger.err(err);
            message.channel.sendMessage(':x: Ошибка.');
          });
        logger.log('New avatar set.');
        message.channel.sendMessage('Новый аватар установлен.');
      }
    },
    {
      prefix: prefix,
      variants: ['stop', 'restart'],
      description: 'Выключает бота. Если был запущен через forever то будет перезагружен.',
      usage: prefix + 'stop',
      permissions: ['TRUSTED'],
      action(message) {
        message.client.destroy().then(() => process.exit(1));
      }
    },
    {
      prefix: prefix,
      variants: ['update', 'upgrade'],
      description: 'Обновляет бота и выключает его.',
      usage: prefix + 'update',
      permissions: ['OWNER'],
      action(message) {
        child = exec("git pull origin master", function (error, stdout, stderr) {
          if(error) return logger.error(error);
          message.client.destroy().then(() => process.exit(1));
        });
      }
    },
  ],
};
