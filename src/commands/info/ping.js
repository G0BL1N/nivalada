const { getString: l } = require('../../localeEngine.js');

module.exports = {
  variants: ['ping'],
  usage: 'ping',
  async action(message) {
    let pingTimestamp = message.createdTimestamp;
    const reply = await message.channel.send(l(message.guild, 'ping_reply'));

    let pongTimestamp = reply.createdTimestamp;
    const delta = pongTimestamp-pingTimestamp;
    reply.edit(l(message.guild, 'ping_full_reply', delta));
  }
}
