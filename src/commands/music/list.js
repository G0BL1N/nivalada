const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['ls', 'list'],
  description: 'Список треков в очереди.',
  usage: 'list',
  async action(message) {
    let queue = voiceHandler[message.guild.id];
    queue.setTextChannel(message.channel);
    queue.list();
  }
}
