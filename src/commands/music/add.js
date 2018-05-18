
const { getGuildString } = require('../../locales.js');
const music = require('../../music.js');

module.exports = {
  variants: ['add', 'a', 'play', 'p', 'queue', 'q'],
  usage: 'add bad apple',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const queue = music.getQueue(message.guild.id);
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.channel.send(l('not_in_voice'));
    }
    if (!queue.connection) {
      music.join(queue, voiceChannel);
    }
    music.setTextChannel(queue, message.channel);
    music.add(queue, arg, message.author);
  }
}
