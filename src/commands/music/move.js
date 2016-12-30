const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['move', 'mv'],
  description: 'Перемещает бота на ваш голосовой канал.',
  usage: 'move',
  async action(message) {
    let id = message.guild.id;
    voiceHandler[id].move(message.member.voiceChannel);
  }
}
