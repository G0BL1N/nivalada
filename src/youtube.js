const ytdl = require('ytdl-core');
const request = require('request');
const querystring = require('querystring');
const fs = require('fs');
const key = require('../config.json').googleKey;



function cache(query) {
  return new Promise((resolve, reject) => {
    search(query)
    .then((result) => {
      let id = result.id.videoId;
      let url = 'https://www.youtube.com/watch?v=' + id;
      try {
        fs.mkdirSync('./cache');
      } catch(e) {
        if (e.code != 'EEXIST') throw e;
      };
      let writeStream = fs.createWriteStream('./cache/' + id);
      ytdl(url, {filter: 'audioonly'})
      .pipe(writeStream);
      writeStream.on('finish', () => {
        resolve(result);
      });
    })
    .catch((err) => {
      reject(err);
    });
  });

}

function search(query) {
  let ytregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  let youtubeID = query.match(ytregexp);
  query = youtubeID ? youtubeID : query;
  query = querystring.escape(query);
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet' +
  `&maxResults=1&key=${key}&q=${query}&type=video&order=relevance`;
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let obj = JSON.parse(body);
        if(obj.pageInfo.totalResults < 1) reject(1);
        resolve(obj.items[0]);
      } else reject(2);
    });
  });
}

module.exports = {
  cache,
  search
}
