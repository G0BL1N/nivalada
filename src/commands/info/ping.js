const l = require('../../localeEngine.js');

module.exports = {
  variants: ['ping'],
  usage: 'ping',
  async action(message) {
    let pingTimestamp = message.createdTimestamp;
    const reply = await message.channel.send(
      l.getString(message.guild, 'ping_reply'));
    let pongTimestamp = reply.createdTimestamp;
    reply.edit(
      l.getString(message.guild, 'ping_full_reply', pongTimestamp-pingTimestamp));
  }
}
