const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['shuffle', 'shu'],
  description: 'Перемешивает очередь.',
  usage: 'shuffle',
  async action(message) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.shuffle();
    let channel = message.channel;
    channel.send(':twisted_rightwards_arrows: Очередь перемешана.');
  }
}
