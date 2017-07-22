const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['list', 'ls'],
  description: 'Список треков в очереди.',
  usage: 'list',
  async action(message) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.list();
  }
}
