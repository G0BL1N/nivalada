const { getGuildString } = require('../../localeEngine.js');
const music = require('../../music.js');

module.exports = {
  variants: ['queue', 'q', 'play', 'p', 'add', 'a'],
  usage: 'queue',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const queue = music.getQueue(message.guild.id);
    const voiceChannel = message.member.voiceChannel;

    if (!queue.connection) {
      music.join(queue, voiceChannel);
    }
    music.setTextChannel(queue, message.channel);
    music.add(queue, arg, message.author);
  }
}
