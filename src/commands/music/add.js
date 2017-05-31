const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['add', 'q'],
  description: 'Ищет трек на Youtube и добавляет в очередь, допустимы' +
  ' ссылки на Youtube или название.',
  usage: 'q rickroll',
  async action(message, args) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.connect(message.member)
    .then(() => queue.add(args, message.author));
  }
}
