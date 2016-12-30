const exec = require('child_process').exec;

module.exports = {
  variants: ['update', 'upgrade'],
  description: 'Обновляет бота и выключает его.',
  usage: 'update',
  permissions: ['OWNER'],
  action(message, args) {
    let from = args ? args : 'master';
    child = exec('git pull origin ' + from, function (error, stdout, stderr) {
      if(error) return logger.error(error);
      message.channel.send(`\`${stdout}\``);
    });
  }
}
