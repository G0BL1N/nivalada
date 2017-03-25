const audioHandler = require('./audioHandler.js');
const fs = require('fs');
const logger = require('./logger.js');

var container = {};

module.exports = container;
module.exports.queues = container;

module.exports.init = function (Client) {
  let guilds = Client.guilds.array();
  for(const guild of guilds) {
    container[guild.id] = new Queue();
  }
}
module.exports.add = function (guild) {
  container[guild.id] = new Queue();
}
module.exports.remove = function (guild) {
  delete container[guild.id];
}


class Queue {

  constructor() {
    this.array = [];
    this.connection = null;
    this.pendingConnetion = null;
    this.nowPlaying = null;
    this.dispatcher = null;
    this.currentDispatcher = null;
    this.textChannel = null;
    this.volume = 100;
  }
  move(channel) {
    return channel.join().then((connection) => this.connection = connection)
    .catch(logger.error);
  }
  connect(member) {
    if(this.connection || this.pendingConnetion)
      return Promise.resolve(this.connection);
    if(!member.voiceChannel) {
      //warning message
      return Promise.reject();
    }
    return this.move(member.voiceChannel);
  }
  add(query, author) {
    let pending = this.textChannel.send('Кеширую...')
      .then((message) => {
        return message;
      })
    audioHandler.handle(query, author)
      .then((result) => {
        let str = `:white_check_mark: Добавлено: **${result.title}**`;
        pending.then(message => message.edit(str));
        this.array.push(result);
        this.play();
      })
      .catch((err) => {
        if(err.message === 'Not found') {
          pending.then(message => message.edit(':x: Не найдено.'));
          return;
        }
        logger.error(err);
        throw err;
      });
  }
  addStream(url, author) {
    let result = audioHandler.handleStream(url, author)
    this.textChannel.send(
        `:white_check_mark: Добавлено: **${result.title}**`);
    this.array.push(result);
    this.play();
  }
  play() {
    if(!this.array[0] || this.nowPlaying) return;
    this.nowPlaying = this.array.shift();
    let stream = this.nowPlaying.getStream();
    let streamOptions = {volume: this.volume/100};
    this.dispatcher = this.connection.playStream(stream, streamOptions);
    let timeout = setTimeout(() => {
      this.textChannel.sendEmbed(this.nowPlaying.embed);
      timeout = null;
    }, 300);
    this.dispatcher.once('end', () => {
      if(timeout) {
        clearTimeout(timeout);
        this.nowPlaying = null;
        this.dispatcher = null;
        this.array.unshift(this.nowPlaying);
        this.play();
        return;
      }
      this.destroyWithCheck(this.nowPlaying);
      this.nowPlaying = null;
      this.dispatcher = null;
      this.play();
    });
  }
  skip() {
    if(!this.nowPlaying) return;
    this.dispatcher.end();
  }
  setTextChannel(channel) {
    this.textChannel = channel;
  }
  setVolume(num) {
    num = parseInt(num);
    if(!num) return;
    this.volume = Math.min(Math.max(num, 0), 100);
    this.textChannel.send(`:loud_sound: Громкость: ${this.volume}%`);
    if(this.nowPlaying) this.dispatcher.setVolume(this.volume/100);
  }
  removeAll() {
    for(const a of this.array)
      a.destroy();
    this.array = [];
  }
  remove(num) {
    num = num - 1;
    num = Math.min(Math.max(num, 0), this.array.length -1);
    const toDestroy = this.array.splice(num, 1)
    this.destroyWithCheck(toDestroy);
  }
  list() {
    if(!this.nowPlaying) {
      this.textChannel.send('Очередь пуста.');
      return;
    }
    let message = `:notes: Сейчас играет: ${this.nowPlaying}\n`;
    if(this.array[0]) {
      message += ':arrow_forward: В очереди:\n'
      for(const key in this.array) {
        if(message.length > 1900) {
          message += '**...**';
          break;
        }
        message += `**${parseInt(key)+1}.** ${this.array[key]}\n`;
      }
    } else {
      message += 'Очередь пуста.'
    }
    this.textChannel.send(message);
  }
  shuffle() {
    if(this.array.length < 2) return;
    let array = this.array;
    let i = array.length;
    while (--i) {
       let j = Math.floor(Math.random() * (i + 1));
       [array[i], array[j]] = [array[j], array[i]];
    }
  }
  destroyWithCheck(audio) {
    for(const a of this.array) {
      if(a.type === 'stream')
        continue;
      if(audio.path === audio.path) {
        return;
      }
    }
    audio.destroy()
  }
  leave() {
    if(!this.connection) return;
    this.removeAll();
    if(this.nowPlaying) this.skip();
    this.connection.channel.leave();
    this.connection = null;
  }
}
