const voiceHandler = require('../../voiceHandler.js');

module.exports = {
  variants: ['add', 'q'],
  description: 'Ищет трек на Youtube и добавляет в очередь, допустимы' +
  ' ссылки на Youtube или название.',
  usage: 'q rickroll',
  async action(message, args) {
    let queue = voiceHandler[message.guild.id];

    queue.setTextChannel(message.channel);
    queue.connect(message.member)
    .then(() => queue.add(args, message.author));
  }
}
