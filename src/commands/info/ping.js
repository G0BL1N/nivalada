const l = require('../../localeEngine.js');

module.exports = {
  variants: ['ping'],
  usage: 'ping',
  async action(message) {
    let pingTimestamp = message.createdTimestamp;
    const text1 = await l.getString(message.guild, 'ping_reply');

    const reply = await message.channel.send(text1);

    let pongTimestamp = reply.createdTimestamp;
    const text2 = await
      l.getString(message.guild, 'ping_full_reply', pongTimestamp-pingTimestamp);
    reply.edit(text2);
  }
}
