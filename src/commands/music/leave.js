const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['leave', 'lv'],
  description: 'Бот покидает голосовой канал и очищает очередь.',
  usage: 'leave',
  async action(message) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.leave();
  }
}
