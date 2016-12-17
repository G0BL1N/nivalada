const audioHandler = require('./audioHandler.js');
const fs = require('fs');
const request = require('request');
const logger = require('./logger.js');
const moment = require('moment');
require("moment-duration-format");

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



class Queue {

  constructor() {
    this.array = [];
    this.connection = null;
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
    if(this.connection) return Promise.resolve(this.connection);
    if(!member.voiceChannel) {
      //warning message
      return Promise.reject();
    }
    return this.move(member.voiceChannel);
  }
  add(query, author) {
    //message about caching
    audioHandler.handle(query, author)
    .then((result) => {
      this.array.push(result);
      this.play();
    });
  }
  play() {
    if(!this.array[0] || this.nowPlaying) return;
    this.nowPlaying = this.array.shift();
    this.message('🎶 Сейчас играет: ' + this.nowPlaying);
    let stream = this.nowPlaying.getStream();
    let streamOptions = {volume: this.volume/100};
    this.dispatcher = this.connection.playStream(stream, streamOptions);
    this.dispatcher.on('end', () => {
      this.nowPlaying.destroy();
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
    this.volume = Math.min(Math.max(num, 0), 100);
    this.textChannel.sendMessage(`🔊 Громкость: ${this.vol}%`);
    if(this.nowPlaying) this.dispatcher.setVolume(this.volume/100);
  }
  remove(num) {
    if(num === undefined) {
      this.array = [];
      this.message(':white_check_mark: Список очищен.');
      return;
    }
    num = Math.min(Math.max(num, 0), this.array.length -1);
    let removed = this.array.splice(num, 1);
    removed.destroy();
  }
  message(str) {
    this.textChannel.sendMessage(str);
  }
  leave() {
    if(!this.connection) return;

  }
}
