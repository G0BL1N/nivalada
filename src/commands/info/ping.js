const { getGuildString } = require('../../locales.js');

module.exports = {
  variants: ['ping'],
  usage: 'ping',
  async action(message) {
    const l = getGuildString(message.guild);
    const pingTimestamp = message.createdTimestamp;
    const reply = await message.channel.send(l('ping_reply'));

    const pongTimestamp = reply.createdTimestamp;
    const delta = pongTimestamp - pingTimestamp;
    reply.edit(l('ping_full_reply', delta));
  }
}
