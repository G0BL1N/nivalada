const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['addytstream', 'qyts'],
  description: 'Ищет стрим на Youtube и добавляет в очередь, допустимы' +
  ' ссылки на Youtube или название.',
  usage: 'qyts rickroll',
  async action(message, args) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    queue.connect(message.member)
    .then(() => queue.addYTStream(args, message.author));
  }
}
