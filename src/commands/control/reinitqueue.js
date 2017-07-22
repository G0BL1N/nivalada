const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['reinitqueue', 'riq'],
  description: 'Перезапускает очередь.',
  usage: 'riq',
  permissions: ['ADMINISTRATOR'],
  async action(message, args) {
    QueuesManager.reinitQueue(message.guild.id);
  }
}
