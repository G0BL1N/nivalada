const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['lv', 'leave'],
  description: 'Бот покидает голосовой канал и очищает очередь.',
  usage: 'leave',
  async action(message) {
    let queue = voiceHandler[message.guild.id];
    queue.setTextChannel(message.channel);
    queue.leave();
  }
}
