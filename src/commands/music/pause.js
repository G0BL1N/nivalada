const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['pause', 'p'],
  description: 'Ставит музыку на пузу, или снимает её с паузы на этом сервере.',
  usage: 'p',
  async action(message, args) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.togglePause();
  }
}
