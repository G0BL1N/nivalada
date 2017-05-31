const QueuesManager = require('../../QueuesManager.js');

module.exports = {
  variants: ['rm', 'remove'],
  description: 'Бот удаляет указанный трек из очереди' +
  ' или очищает всю очередь если было указано \`all\`.',
  usage: 'rm 2',
  async action(message, args) {
    let queue = QueuesManager.getQueue(message.guild.id);

    queue.setTextChannel(message.channel);
    if(args === 'all') {
      queue.removeAll();
      message.channel.send(':white_check_mark: Очередь очищена.');
      return;
    }
    let num = parseInt(args);
    if(!num) return;
    queue.remove(num);
  }
}
