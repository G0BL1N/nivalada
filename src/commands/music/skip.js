const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['skip', 'next', 's', 'n'],
  description: 'Бот пропускает текущий трек.',
  usage: 'skip',
  async action(message) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.skip();
  }
}
