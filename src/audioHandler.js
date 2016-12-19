const querystring = require('querystring');
const fs = require('fs');
const request = require('request-promise-native');
const youtubedl = require('youtube-dl');
const {googlekey: gkey} = require('../config.json');
const Discord = require('discord.js');


module.exports = {
  handle,
  handleStream,
  ytSearch
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
function handleStream(url, author) {
  return new Audio({
    type: 'stream',
    url: url,
    author: author
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
        data: data,
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
  constructor({type, filename, url, data, author}) {
    if(type === 'file') {
      this.type = 'file';
      this.path = './cache/' + filename;

      let authorname = `${author.username}#${author.discriminator}`;
      this.title = data.title ? data.title : 'Unnamed';
      if(data.duration) {
        let duration = data.duration.split(':').reverse();
        let sec = duration[0];
        duration[0] = sec.length === 1 ? '0' + sec : sec;
        duration[1] = duration[1] ? duration[1] : '0';
        duration = duration.reverse().join(':');
        this.title += ` (${duration})`;
      }
      this.embed = new Discord.RichEmbed()
        .setColor('#5DADEC') //blue color, same as :notes:
        .setAuthor(authorname, author.avatarURL)
        .setTitle(this.title)
        .setFooter('Сейчас играет');
      if(data.thumbnail)
        this.embed.setThumbnail(data.thumbnail);

    }
    else if(type === 'stream') {
      this.type = 'stream';
      this.url = url;
      this.title = url;
      let authorname = `${author.username}#${author.discriminator}`;
      this.embed = new Discord.RichEmbed()
        .setColor('#226699') //dark blue
        .setAuthor(authorname, author.avatarURL)
        .setTitle(this.title)
        .setFooter('Сейчас играет');
    }
  }
  getStream() {
    if(this.type === 'file') {
      return fs.createReadStream(this.path);
    }
    if(this.type === 'stream') {
      return request(this.url);
    }
  }
  destroy() {
    if(this.type !== 'file') return;
    return fs.unlink(this.path, (err) => {if(err) throw err});
  }
}
