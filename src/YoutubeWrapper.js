const fs = require('fs');
const youtubedl = require('youtube-dl');
const request = require('request');
const requestp = require('request-promise-native');
const {googlekey: gkey} = require('../config.json');
const {AudioFile, YoutubeStream} = require('./Audio.js');

class YoutubeWrapper {

  getTYStream(query) {
    let url;
    let httpRegExp = /^(http|https):\/\//i;
    if(httpRegExp.test(query)) {
      url = query;
    } else {
      return this.search(query, {type: 'video', eventType: 'live'})
        .then((result) => {
          return this.getTYStream('https://www.youtube.com/watch?v=' + result.id.videoId);
        });
    }
    return new Promise((resolve, reject) => {
      let video = youtubedl(url, ['--format=93/best'], {maxBuffer: Infinity});
      video.on('info', (data) => {
        let stream = new YoutubeStream(url, data.title, video);
        if(data.thumbnail)
          stream.setThumbnail(data.thumbnail);
        resolve(stream);
      });
      video.on('error', (err) => reject(err));
    })
  }
  getAudio(query) {
    let url;
    let httpRegExp = /^(http|https):\/\//i;
    if(httpRegExp.test(query)) {
      url = query;
    } else {
      return this.search(query, {type: 'video'})
        .then((result) => {
          return this.cache('https://www.youtube.com/watch?v=' + result.id.videoId);
        });
    }
    let [, filename] = /\W(\w+)$/i.exec(url);
    let path = './cache/' + filename;
    let writeStream = fs.createWriteStream(path);
    return new Promise((resolve, reject) => {
      let video = youtubedl(url, ['--format=bestaudio/worst'], {maxBuffer: Infinity});
      video.pipe(writeStream);
      let data;
      video.on('info', (info) => data = info);
      video.on('end', () => {
        let audio = new AudioFile(path, data.title);
        if(data.duration)
          audio.setDuration(data.duration);
        if(data.thumbnail)
          audio.setThumbnail(data.thumbnail);
        resolve(audio);
      });
      video.on('error', (err) => reject(err));
    })
  }
  search(query, options = {}) {
    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet';
    options.q = encodeURIComponent(query);
    options.maxResults = 1;
    options.key = gkey;
    for(const opt in options)
      url += `&${opt}=${options[opt]}`;
    return requestp( {uri: url, json: true} )
      .then((result) => {
        if(result.pageInfo.totalResults < 1) throw new Error('Not found');
        return result.items[0];
      });
  }

}



module.exports = new YoutubeWrapper();
