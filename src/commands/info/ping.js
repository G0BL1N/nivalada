const { getGuildString } = require('../../localeEngine.js');

module.exports = {
  variants: ['ping'],
  usage: 'ping',
  async action(message) {
    const l = getGuildString(message.guild);
    let pingTimestamp = message.createdTimestamp;
    const reply = await message.channel.send(l('ping_reply'));

    let pongTimestamp = reply.createdTimestamp;
    const delta = pongTimestamp-pingTimestamp;
    reply.edit(l('ping_full_reply', delta));
  }
}
