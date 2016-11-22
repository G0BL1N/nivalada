const youtube = require('./youtube.js');
const fs = require('fs');
const request = require('request');


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
    this.mq = null;
    this.vol = 100;
  }
  push(query) {
    this.send('Кэширую...');
    youtube.search(query, {type : 'video'})
    .then((result) => {
      youtube.cache(result.id.videoId)
      .then(() => {
        let audio = new Audio(result, false);
        this.array.push(audio);
        this.send(`🎶 В очереди: **${audio.title}**`);
        if(!this.playing) this.next();
      });
    })
    .catch(console.error);
  }
  pushPlaylist(query) {
    let realthis = this;
    this.send('Кэширую...');
    youtube.search(query, {type : 'playlist'})
    .then((result) => {
      youtube.cachePlaylist(result.id.playlistId)
      .then((cp_results) => nextPromise(cp_results));
    });
    function nextPromise(array) {
      let shifted = array.shift();
      if(!shifted) {
        realthis.send('Плейлист полностью кэширован и добавлен в очередь.')
        return;
      }
      shifted.promise.then(() => {
        let audio = new Audio(shifted.info, true);
        realthis.array.push(audio);
        if(!realthis.playing) realthis.next();
        nextPromise(array);
      })
    }
  }
  pushStream(url) {
    let audio = new Stream(url);
    this.array.push(audio);
    this.send(`🎶 В очереди: **${audio.title}**`);
    if(!this.playing) {
      this.next();
    }
  }
  next() {
    this.playing = this.array.shift();
    this.send(`🎶 Сейчас играет: **${this.playing.title}**`);
    let readStream = null;
    if(this.playing instanceof Stream) {
      readStream = request(this.playing.url);
    } else {
      readStream = fs.createReadStream(this.playing.path);
    }
    this.dispatcher = this.connection.playStream(readStream,{vol: this.vol/100});
    this.dispatcher.on('end', () => {
      this.send(`🎶 Завершено: **${this.playing.title}**`);
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
    this.mq = new MessageQueue(channel);
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
      this.send('Очередь пуста.');
      return;
    }
    let msg = 'В очереди: \n';
    let num = 0;
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
    let removed = this.array.splice(num, 1);
    if(removed instanceof Audio) fs.unlinkSync(removed.path);
  }
  send(str) {
    this.mq.put(str);
  }
  leave() {
    if(!this.connection) return;
    this.remove();
    if(this.playing) this.skip();
    this.connection.channel.leave();
    this.connection = null;
  }
}
class Audio {
  constructor(info, isPlaylistInfo) {
    this.title = info.snippet.title;
    if(isPlaylistInfo) {
      this.path = './cache/' + info.snippet.resourceId.videoId;
      return;
    }
    this.path = './cache/' + info.id.videoId;
  }
}
class Stream {
  constructor(url) {
    this.title = url;
    this.url = url;
  }
}
class MessageQueue {
  constructor(channel) {
    this.channel = channel;
    this.pending = null;
    this.strArray = [];
    this.lastMessage = null;
  }
  put(str) {
    if(this.pending == null) {
      this.send(str);
      return;
    }
    this.strArray.push(str);
  }
  resolver(result) {
    this.lastMessage = result;
    let shifted = this.strArray.shift();
    if(!shifted) {
      this.pending = null;
      return;
    }
    this.send(shifted);
  }
  send(str) {
    if(this.lastMessage != null && this.lastMessage.id == this.channel.lastMessageID) {
      this.pending = this.lastMessage.edit(str)
      .then(result => this.resolver(result))
      .catch(console.error);
      return;
    }
    this.pending = this.channel.sendMessage(str)
    .then(result => this.resolver(result))
    .catch(console.error);
  }
}

module.exports = Queues;
