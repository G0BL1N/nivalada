const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['volume', 'vol', 'v'],
  description: 'Устанавливает громкость музыки для этого сервера.',
  usage: 'vol 45',
  async action(message, args) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.setVolume(args);
  }
}
