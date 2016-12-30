const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['volume', 'vol', 'v'],
  description: 'Устанавливает громкость музыки для этого сервера.',
  usage: 'vol 45',
  async action(message, args) {
    let queue = voiceHandler[message.guild.id];
    queue.setTextChannel(message.channel);
    voiceHandler[message.guild.id].setVolume(args);
  }
}
