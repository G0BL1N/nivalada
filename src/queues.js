const youtube = require('./youtube.js');
const fs = require('fs');
const request = require('request');


class Audio {
  constructor(info) {
    this.title = info.snippet.title;
    this.path = './cache/' + info.id.videoId;;
  }
}
class Stream {
  constructor(url) {
    this.title = url;
    this.url = url;
  }
}
class Queues {
  constructor(Client) {
    this.container = {};
    let guilds = Client.guilds.array();
    for(let key in guilds) {
      let guild = guilds[key];
      this.container[guild.id] = new Queue();
    }
  }
  get(id) {
    return this.container[id];
  }
}

class Queue {

  constructor() {
    this.array = [];
    this.playing = null;
    this.connection = null;
    this.dispatcher = null;
    this.textChannel = null;
    this.vol = 100;
  }
  push(query) {
    youtube.cache(query)
    .then((result) => {
      let audio = new Audio(result);
      this.array.push(audio);
      this.textChannel.sendMessage(`🎶 В очереди: **${audio.title}**`);
      if(!this.playing) {
        this.next();
      }
    })
    .catch((err) => {
      //do something
    });
  }
  pushStream(url) {
    let audio = new Stream(url);
    this.array.push(audio);
    this.textChannel.sendMessage(`🎶 В очереди: **${audio.title}**`);
    if(!this.playing) {
      this.next();
    }
  }
  next() {
    this.playing = this.array.shift();
    this.textChannel.sendMessage(`🎶 Сейчас играет: **${this.playing.title}**`);
    let readStream = null;
    if(this.playing instanceof Stream) {
      readStream = request(this.playing.url);
    } else {
      readStream = fs.createReadStream(this.playing.path);
    }
    this.dispatcher = this.connection.playStream(readStream,{vol: this.vol/100});
    this.dispatcher.on('end', () => {
      this.textChannel.sendMessage(`🎶 Завершено: **${this.playing.title}**`);
      if(this.playing instanceof Audio) fs.unlinkSync(this.playing.path);
      this.playing = null;
      this.dispatcher = null;
      if(this.array[0]) {this.next();}
    });
  }
  skip() {
    if(!this.playing) return;
    this.dispatcher.end();
  }
  move(channel) {
    return new Promise((resolve, reject) => {
      channel.join()
      .then((connection) => {
        this.connection = connection;
        resolve(channel);
      })
      .catch(reject);
    });

  }
  setTextChannel(channel) {
    this.textChannel = channel;
  }
  setVol(num) {
    this.vol = Math.min(Math.max(num, 0), 100);
    this.textChannel.sendMessage(`🔊 Громкость: ${this.vol}%`)
    .then(message => message.delete(1500));
    if(this.playing) {
      this.dispatcher.setVolume(this.vol/100);
    }
  }
  list() {
    if(!this.array[0]) {
      this.textChannel.sendMessage('Очередь пуста.');
      return;
    }
    let msg = 'В очереди: \n';
    for(let audio of this.array) {
      msg = msg + `${++num}. **${audio.title}**\n`;
    }
    this.textChannel.sendMessage(msg);
  }
  remove(num) {
    if(!num) {
      this.array = [];
      //message
      return;
    }
    if(num < 0 || num > this.array.length -1) {
      //message
      return;
    }
    this.array.splice(num,1);
  }
  leave() {
    if(!this.connection) return;
    this.remove();
    if(this.playing) this.skip();
    this.connection.channel.leave();
    this.connection = null;
  }
}

module.exports = Queues;
