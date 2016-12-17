const querystring = require('querystring');
const fs          = require('fs');
const request     = require('request-promise-native');
const youtubedl   = require('youtube-dl');
const gkey        = require('../config.json').googlekey;
const moment      = require('moment');
                    require("moment-duration-format");



module.exports = {
  handle,
  ytSearch,
  cache,
}

function handle(query, author) {
  let httpRegExp = /^(http|https):\/\//i;
  if(httpRegExp.test(query)) {
    return cache(query, author)
    .then((result, err) => {
      if(err)
        throw err;

      return result;
    });
  }
  return ytSearch(query)
  .then((result) => {
    let id = result.id.videoId;
    return cache('https://www.youtube.com/watch?v=' + id, author);
  });
}

function cache(url, author) {
  let [, filename] = /\W(\w+)$/i.exec(url);
  let path = './cache/' + filename;
  let writeStream = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
    let video = youtubedl(url, ['--format=bestaudio/worst'], {maxBuffer: Infinity});
    video.pipe(writeStream);
    let data;
    video.on('info', (info) => data = info);
    video.on('end', () => {
      let audio = new Audio({
        type: 'file',
        filename: filename,
        title: data.title,
        duration: data.duration,
        author: author
      });
      resolve(audio);
    });



    video.on('error', (err) => reject(err));
  })
}

function ytSearch(query, options = {}) {
  query = querystring.escape(query);
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet';
  options.maxResults = 1;
  options.key = gkey;
  options.q = query;
  url = attachOptions(url, options);
  return request(url)
  .then((body) => {
    let result = JSON.parse(body);
    if(result.pageInfo.totalResults < 1) throw new Error('Not found');
    return result.items[0];
  });
}

function attachOptions(url, options) {
  for(const opt in options)
    url += `&${opt}=${options[opt]}`;
  return url;
}

class Audio {
  constructor({type, filename, url, title, duration, author}) {
    if(type === 'file') {
      this.type = 'file';
      this.path = './cache/' + filename;
      this.title = title;

      let splitted = duration.split(':');
      splitted.reverse();
      let [s, m, h, d] = splitted;
      this.duration = moment.duration({s, m, h, d});
    }
    else if(type === 'stream') {
      this.type = 'stream';
      this.url = url;
      this.title = url;
    }
    this.author = author;
  }
  getStream() {
    if(this.type === 'file') {
      return fs.createReadStream(this.path);
    }
    if(this.type === 'stream') {
      return request(this.url);
    }
  }
  toString() {
    let dur = (this.type == 'file') ? this.duration.format('d:h:m:ss') : '∞';
    let author = this.author.username+'#'+this.author.discriminator;
    return `**${this.title}** (${dur}), добавлено ${author}`;
  }
  destroy() {
    if(this.type !== 'file') return;
    return fs.unlink(this.path, (err) => {if(err) throw err});
  }
}
