module.exports = {
  variants: ['ping', 'пинг'],
  description: 'Пинг до бота.',
  usage: 'ping',
  async action(message) {
    let pingTimestamp = message.createdTimestamp;
    message.channel.send('Понг!')
      .then((reply) => {
        let pongTimestamp = reply.createdTimestamp;
        reply.edit(`Понг! Заняло \`${pongTimestamp-pingTimestamp}мс\``);
      });
  }
}
