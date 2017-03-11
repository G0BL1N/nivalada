module.exports = {
  variants: ['purge'],
  description: 'Удаляет указанное количество сообщений из данного канала.',
  usage: 'bulk 5',
  permissions: ['MANAGE_MESSAGES'],
  async action(message, args) {
    let num = parseInt(args);
    if(!num) return;
    message.channel.bulkDelete(num + 1);
  }
}
