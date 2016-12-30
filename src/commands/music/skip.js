const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['skip', 'next', 's', 'n'],
  description: 'Бот пропускает текущий трек.',
  usage: 'skip',
  async action(message) {
    let queue = voiceHandler[message.guild.id];
    queue.setTextChannel(message.channel);
    queue.skip();
  }
}
