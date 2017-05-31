const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['move', 'mv'],
  description: 'Перемещает бота на ваш голосовой канал.',
  usage: 'move',
  async action(message) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.move(message.member.voiceChannel);
  }
}
