const fse = require('fs-extra');
const { getImageColor } = require('./utils.js');
const { RichEmbed } = require('discord.js');
const logger = require('./logger.js');
const { search, cache } = require('./youtubeWrapper.js');
const { getGuildString } = require('./locales.js');

const queues = new Map();

const getQueue = (guildId) => {
  if (!queues.has(guildId)) queues.set(guildId, []);
  return queues.get(guildId);
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

const getTrack = async (queue, query, author) => {
  const { id: { videoId } } = await search(query);
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
    path,
    author,
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
  const embed = new RichEmbed()
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
  const dispatcher = connection.playStream(fileStream);
  sendNowPlaying(queue);
  dispatcher.once('end', () => {
    fileStream.destroy();
    //possible race condition, should be resolved
    if (!queue.includes(playing)) fse.unlink(playing.path);
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
    track = await getTrack(queue, query, author);
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
  if (queue.playing) queue.dispatcher.end();
}

module.exports = {
  getQueue,
  join,
  setTextChannel,
  add,
  skip
}
