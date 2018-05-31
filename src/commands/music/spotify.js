const { getGuildString } = require('../../locales.js');
const music = require('../../music.js');

module.exports = {
  variants: ['spotify'],
  usage: 'spotify',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const queue = music.getQueue(message.guild.id);
    const [, userID] = /^<@\!?(\d+)>$/.exec(arg);
    const user = await message.client.users.fetch(userID);
    const voiceChannel = message.member.voiceChannel;
    if (queue.playing || queue.playingSpotify) {
      message.channel.send(l('spotify_something_playing'));
      return;
    }
    const author = message.author;
    const activity = author.presence && author.presence.activity;
    const name = activity && activity.name;
    const type = activity && activity.type;
    if (name !== 'Spotify' && type !== 'LISTENING') {
      message.channel.send(l('spotify_no_spotify'));
      return;
    }
    if (!queue.connection) {
      music.join(queue, voiceChannel);
    }
    else if (voiceChannel.id !== queue.connection.channel.id) {
      message.channel.send(l('not_in_same_voice'));
      return;
    }
    message.channel.send(l('spotify_playing'));
    music.setTextChannel(queue, message.channel);
    music.playSpotify(queue, user);
  }
}
