const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['addstream', 'qs'],
  description: 'Добавляет аудиострим в очередь.',
  usage: 'qs http://examplesiteitsnotreal.com/stream',
  async action(message, args) {
    let queue = voiceHandler[message.guild.id];
    queue.setTextChannel(message.channel);
    queue.connect(message.member)
    .then(() => queue.addStream(args, message.author));
  }
}
