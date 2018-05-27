
const { getGuildString } = require('../../locales.js');
const music = require('../../music.js');

module.exports = {
  variants: ['leave', 'lv'],
  usage: 'lv',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const queue = music.getQueue(message.guild.id);
    if (!queue.connection) {
      message.channel.send(l('not_connected'));
      return;
    }
    const channel = queue.connection.channel;
    const perms = channel.permissionsFor(message.member);
    if (!perms.has('MANAGE_CHANNELS')) {
      message.channel.send(l('no_permissions'));
      return;
    }
    music.leave(queue);
  }
}
