const fse = require('fs-extra');
const { getImageColor } = require('./utils.js');
const { MessageEmbed } = require('discord.js');
const logger = require('./logger.js');
const { search, cache } = require('./youtubeWrapper.js');
const { getGuildString } = require('./locales.js');

const queues = new Map();

const getQueue = (guild) => {
  const id = guild.id || guild;
  if (!queues.has(id)) queues.set(id, []);
  return queues.get(id);
}

const findInQueues = (track) => {
  const id = track.id || track;
  const entries = [...queues.entries()];
  let found;
  entries.find(([, queue]) => {
    if (queue.playing && queue.playing.id === id) {
      found = queue.playing;
      return true;
    }
    found = queue.find(it => it.id === id);
    return found !== undefined;
  });
  return found;
}

const cleanupTrack = async (track) => {
  if (findInQueues(track)) return;
  await fse.unlink(track.path);
}

const join = async (queue, channel) => {
  try {
    queue.connection = await channel.join();
  } catch(err) {
    logger.error(err);
  }
}

const setTextChannel = (queue, textChannel) => (
  queue.textChannel = textChannel
)

const getTrack = async (query, author) => {
  const { id: { videoId } } = await search(query);
  const found = findInQueues(videoId);
  if (found)
    return found;

  const info = await cache(videoId);
  const path = `./cache/${info.video_id}`;

  let secondsLeft = info.length_seconds;
  const hours = Math.floor(secondsLeft / (60 * 60));
  secondsLeft %= (60 * 60);
  const rawMinutes = Math.floor(secondsLeft / 60);
  const minutes = (hours && rawMinutes < 10) ? `0${rawMinutes}` : rawMinutes;
  secondsLeft %= (60);
  const seconds = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
  const duration = (hours) ? `${hours}:${minutes}:${seconds}`
                           : `${minutes}:${seconds}`;
  return {
    query,
    path,
    author,
    id: videoId,
    title: info.title,
    duration: duration,
    durationSeconds: info.length_seconds,
    thumbnail: info.thumbnail_url
  };
}

const sendNowPlaying = async (queue) => {
  const l = getGuildString(queue.textChannel.guild);
  const track = queue.playing;
  const { title, duration, author: { tag } } = queue.playing;
  const avatarURL = queue.playing.author.avatarURL();
  const color = await getImageColor(track.thumbnail);
  const embed = new MessageEmbed()
    .setColor(color)//.setColor(0x5DADEC) //blue, same as :notes: emoji
    .setTitle(`${title} (${duration})`)
    .setAuthor(tag, avatarURL)
    .setThumbnail(track.thumbnail)
    .setFooter(l('now_playing'))
    .setTimestamp();
  queue.textChannel.send(embed);
}

const play = (queue) => {
  queue.playing = queue.shift();
  const { connection, playing } = queue;
  //const dispatcher = connection.playFile(playing.path);
  const fileStream = fse.createReadStream(playing.path);
  const dispatcher = connection.play(playing.path, { volume: 0.4 });
  queue.dispatcher = dispatcher;
  sendNowPlaying(queue);
  dispatcher.once('end', () => {
    fileStream.destroy();
    cleanupTrack(playing);
    if (queue.length) play(queue);
    else queue.playing = undefined;
  });
}

const add = async (queue, query, author) => {
  const channel = queue.textChannel;
  const l = getGuildString(channel.guild);
  const pending = channel.send(l('caching'));
  let track;
  try {
    track = await getTrack(query, author);
  } catch(err) {
    if (err.message === 'not found') {
      const message = await pending;
      message.edit(l('not_found'), query);
    } else {
      const message = await pending;
      message.edit(l('error'));
      logger.error('Error caching track:\n' + err.stack);
    }
    return;
  }
  queue.push(track);
  if (!queue.playing) play(queue);
  const message = await pending;
  //TODO: Rewrite, maybe add embed
  message.edit(l('cached', track.title, track.duration));
}

const skip = queue => {
  if (queue.playing) {
    queue.dispatcher.end();
    return;
  }
  if (queue.spotify) {
    queue.dispatcher.end();
  }
}

const leave = async (queue) => {
  const tracks = queue.slice();
  queue.length = 0;
  if (queue.playing) queue.dispatcher.end();
  const promises = tracks.map(track =>
    cleanupTrack(track).catch(logger.warn)
  );
  await Promise.all(promises);
  queue.connection.channel.leave();
  queue.connection = undefined;
}

const getPresenceTrack = (user) => {
  const { state: artists, details: trackName, timestamps: { start } }
    = user.presence.activity;
  const [artist] = artists.split('; ');
  const query = `${artist} - ${trackName}`;
  const time = Date.now() - new Date(start);
  return {
    artist,
    query,
    time
  }
}

const presenceUpdate = (oldMember, newMember) => {
  const guild = newMember.guild;
  const queue = getQueue(guild.id);
  const spotifyUserId = queue.spotify && queue.spotify.user.id;
  if (spotifyUserId === oldMember.id) {
    updateSpotify(queue);
  }
}

const playSpotify = async (queue) => {
  if (queue.spotify.playing) {
    queue.dispatcher.end();
    return;
  }
  if (!queue.spotify.next) {
    queue.spotify = undefined;
    //TODO: End spotify properly
    return;
  }
  queue.spotify.playing = queue.spotify.next;
  queue.spotify.next = undefined;
  const { connection, spotify: { playing } } = queue;
  const fileStream = fse.createReadStream(playing.path);
  queue.dispatcher = connection.play(fileStream, {
    seek: (playing.time / 1000),
    volume: 0.4
  });
  queue.dispatcher.on('end', () => {
    fileStream.destroy();
    const { next, playing } = queue.spotify;
    if (!next || next.id !== playing.id) {
      cleanupTrack(queue.spotify.playing);
    }
    queue.spotify.playing = undefined;
    playSpotify(queue);
  });
}

const updateSpotify = async (queue) => {
  const user = queue.spotify.user;
  const activity = user.presence && user.presence.activity;
  const name = activity && activity.name;
  const type = activity && activity.type;
  if (name !== 'Spotify' && type !== 'LISTENING') {
    queue.spotify.next = undefined;
    queue.dispatcher.end();
    const l = getGuildString(queue.textChannel.guild);
    queue.textChannel.send(l('spotify_no_spotify'));
    return;
  }
  const track = getPresenceTrack(user);
  //TODO: Simplify, all ifs are doing the same thing
  if (!queue.spotify.playing) {
    queue.spotify.next = await getTrack(track.query, user);
    queue.spotify.next.time = track.time;
    playSpotify(queue);
    return;
  }
  if (queue.spotify.playing.query !== track.query) {
    queue.spotify.next = await getTrack(track.query, user);
    queue.spotify.next.time = track.time;
    playSpotify(queue);
    return;
  }
  const streamTime = queue.dispatcher.totalStreamTime;
  const currentTime = streamTime + queue.spotify.playing.time;
  if (Math.abs(currentTime - track.time) > 2000) {
    queue.spotify.next = queue.spotify.playing;
    queue.spotify.next.time = track.time;
    playSpotify(queue);
  }
}

const attachSpotify = async (queue, user) => {
  queue.spotify = {
    user
  }
  updateSpotify(queue);
}

module.exports = {
  queues,
  getQueue,
  join,
  setTextChannel,
  add,
  skip,
  leave,
  attachSpotify,
  presenceUpdate
}
