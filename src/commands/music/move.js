const { getGuildString } = require('../../locales.js');
const music = require('../../music.js');

module.exports = {
  variants: ['move', 'mv'],
  usage: 'move',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const queue = music.getQueue(message.guild.id);
    const voiceChannel = message.member.voiceChannel;

    music.setTextChannel(queue, message.channel);
    if (!voiceChannel) {
      message.channel.send(l('not_in_voice'));
      return;
    }
    music.join(queue, voiceChannel);
  }
}
