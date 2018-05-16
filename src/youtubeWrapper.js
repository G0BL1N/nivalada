const fse = require('fs-extra');
const ytdl = require('ytdl-core');
const rp = require('request-promise-native');
const logger = require('./logger.js');
const { googleAPIKey } = require('../credentials.json');

const cacheFolder = './cache';

//making sure cache folder exists
(async () => {
  try {
    await fse.mkdir(cacheFolder);
  } catch(err) {
    if(!err.code === 'EEXIST') {
      logger.error('Error creating cache folder:\n' + err);
      process.exit(0);
    }
  }
})();

const search = async (query) => {
  if (!query) return;
  const options = {
    uri: 'https://www.googleapis.com/youtube/v3/search',
    qs: {
      part: 'snippet',
      q: query,
      maxResults: 1,
      key: googleAPIKey
    },
    json: true
  }
  const result = await rp(options);
  if (result.pageInfo.totalResults < 1) throw new Error('not found');
  return result.items[0];
}

const cache = async (videoId) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const path = `${cacheFolder}/${videoId}`;
  const writeStream = fse.createWriteStream(path);
  const stream = ytdl(url, { quality: 'highestaudio' });
  stream.pipe(writeStream);
  return new Promise(resolve =>
    stream.on('info', info =>
      stream.once('end', () => resolve(info))
    )
  )
}

module.exports = {
  search,
  cache
}
