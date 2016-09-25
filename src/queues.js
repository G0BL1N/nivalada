const youtube = require('./youtube.js');
const fs = require('fs');


class Audio {
  constructor(info) {
    this.title = info.snippet.title;
    this.path = './cache/' + info.id.videoId;;
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
  next() {
    this.playing = this.array.shift();
    this.textChannel.sendMessage(`🎶 Сейчас играет: **${this.playing.title}**`);
    this.dispatcher = this.connection.playFile(this.playing.path,{vol: this.vol});
    this.dispatcher.on('end', () => {
      this.textChannel.sendMessage(`🎶 Завершено: **${this.playing.title}**`);
      fs.unlink(this.playing.path);
      this.playing = null;
      this.dispatcher = null;
      if(this.array[0]) {this.next();}
    });
  }
  skip() {
    if(!this.dispatcher) return;
    this.dispatcher.end();
  }
  move(channel) {
    channel.join()
    .then((connection) => {
      this.connection = connection;
    })
    .catch((err) => {
      //do something
    });
  }
  setTextChannel(channel) {
    this.textChannel = channel;
  }
  setVol(num) {
    this.vol = Math.min(Math.max(num, 0), 100);
    this.textChannel.sendMessage(`🔊 Громкость: ${this.vol}%`);
    if(this.dispatcher) {
      this.dispatcher.setVolume(this.vol/100);
    }
  }
}

module.exports = Queues;
