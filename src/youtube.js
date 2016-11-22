const ytdl = require('ytdl-core');
const request = require('request');
const querystring = require('querystring');
const fs = require('fs');
const key = require('../config.json').googlekey;



function cache(videoId) {
  return new Promise((resolve, reject) => {
    let url = 'https://www.youtube.com/watch?v=' + videoId;
    try {
      fs.mkdirSync('./cache');
    } catch(e) {
      if (e.code != 'EEXIST') throw e;
    };
    let writeStream = fs.createWriteStream('./cache/' + videoId);
    ytdl(url, {filter: 'audioonly'}).pipe(writeStream);
    writeStream.on('finish', () => {
      resolve(true);
    });
  });
}
function cachePlaylist(playlistId) {
    let url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
    `&maxResults=30&key=${key}&playlistId=${playlistId}`;
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let obj = JSON.parse(body);
          if(obj.pageInfo.totalResults < 1) reject('cachePlaylist rejecton: no results');
          let result = obj.items.map((value) => {
            return {
              promise : cache(value.snippet.resourceId.videoId),
              info : value
            }
          });
          resolve(result);
        } else reject('cachePlaylist rejecton: network error');
    });
  });
}

function search(query, options) {
  let ytregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  let youtubeID = query.match(ytregexp);
  query = youtubeID ? youtubeID : query;
  query = querystring.escape(query);
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet' +
  `&maxResults=1&key=${key}&q=${query}`;
  url += (options.type ? `&type=${options.type}` : '');
  url += (options.order ? `&order=${options.order}` : '');
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let obj = JSON.parse(body);
        if(obj.pageInfo.totalResults < 1) reject('search rejecton: no results');
        resolve(obj.items[0]);
      } else reject('search rejecton: network error');
    });
  });
}

module.exports = {
  cache,
  cachePlaylist,
  search
}
