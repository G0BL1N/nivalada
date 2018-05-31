const fse = require('fs-extra');
const { getImageColor } = require('./utils.js');
const { MessageEmbed } = require('discord.js');
const logger = require('./logger.js');
const { search, cache } = require('./youtubeWrapper.js');
const { getGuildString } = require('./locales.js');

const queues = new Map();

const getQueue = (guildId) => {
  if (!queues.has(guildId)) queues.set(guildId, []);
  return queues.get(guildId);
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
  })
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
    thumbnail: info.thumbnail_url
  };
}

const sendNowPlaying = async (queue) => {
  const l = getGuildString(queue.textChannel.guild);
  const track = queue.playing;
  const { title, duration, author: { tag, avatarURL } } = queue.playing;
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
  const dispatcher = connection.play(playing.path);
  sendNowPlaying(queue);
  dispatcher.once('end', () => {
    fileStream.destroy();
    cleanupTrack(playing);
    if (queue.length) play(queue);
    else queue.playing = undefined;
  });
  queue.dispatcher = dispatcher;
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
      logger.error(err);
    }
    return;
  }
  queue.push(track);
  if (!queue.playing) play(queue);
  const message = await pending;
  message.edit(l('cached'));
}

const skip = queue => {
  if (queue.playing) {
    queue.dispatcher.end();
    return;
  }
  if (queue.playingSpotify) {
    queue.skipSpotify = true;
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

const getPlayTime = (user) => {
  const { activity: { timestamps: { start } } } = user.presence;
  const startDate = new Date(start);
  return Date.now() - startDate;
}

const playSpotify = async (queue, user, interval) => {
  const { activity: {state: artists, details: trackName} } = user.presence;
  const [artist] = artists.split('; ');
  const trackQuery = `${artist} - ${trackName}`;
  if (queue.playingSpotify) {
    if (queue.playingSpotify.query !== trackQuery) {
      clearInterval(interval);
      await getTrack(trackQuery, user);
      queue.skipSpotify = true;
      queue.dispatcher.end();
    }
    const playTime = getPlayTime(user);
    const streamTime = queue.dispatcher.totalStreamTime;
    const currentTime = streamTime + queue.playingSpotify.started;
    if (Math.abs(currentTime - playTime) > 2000) {
      queue.dispatcher.end();
    }
    return;
  }
  const track = await getTrack(trackQuery, user);
  queue.playingSpotify = track;
  const { connection } = queue;
  const fileStream = fse.createReadStream(queue.playingSpotify.path);
  const playTime = getPlayTime(user);
  queue.playingSpotify.started = playTime;
  const dispatcher = connection.play(fileStream, { seek: (playTime / 1000) });
  const updating = setInterval(() => {
    playSpotify(queue, user, updating)
  }, 3000);
  dispatcher.on('end', () => {
    fileStream.destroy();
    cleanupTrack(queue.playingSpotify);
    queue.playingSpotify = undefined;
    clearInterval(updating);
    if (queue.skipSpotify) {
      queue.skipSpotify = undefined;
      const l = getGuildString(queue.textChannel.guild);
      queue.textChannel.send(l('spotify_skip'));
      return;
    }
    playSpotify(queue, user);
  });
  queue.dispatcher = dispatcher;
}


module.exports = {
  queues,
  getQueue,
  join,
  setTextChannel,
  add,
  skip,
  leave,
  playSpotify
}
