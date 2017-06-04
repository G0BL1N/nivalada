const fs = require('fs');
const {RichEmbed} = require('discord.js');

class Audio {

  constructor(type, title) {
    this.type = type;
    this.title = title;
    this.duration = '???';
  }
  setAuthor(author) {
    this.author = author;
  }
  getEmbed(color) {
    let embed = new RichEmbed()
      .setColor(color)
      .setTitle(this.title + ` (${this.duration})`)
      .setFooter('Сейчас играет');
    if(this.author)
      embed.setAuthor(this.author.tag, this.author.avatarURL);

    return embed;
  }
  toString() {
    return `**${this.title + ` (${this.duration})`}**, добавлено ${this.author.tag}`;
  }
  destroy() {}

}

class AudioFile extends Audio {

  constructor(path, title) {
    super('file', title);
    this.path = path;
  }
  setDuration(duration) {
    duration = duration.split(':').reverse();
    let sec = duration[0];
    duration[0] = (sec.length === 1) ? '0' + sec : sec;
    if((duration[1]) == '0' && duration[2])
      duration[1] = '00';
    else
      duration[1] = duration[1] ? duration[1] : '0';
    this.duration = duration.reverse().join(':');
  }
  setThumbnail(url) {
    this.thumbnail = url;
  }
  getEmbed() {
    let embed = super.getEmbed(0x5DADEC) //blue color, same as :notes:
    if(this.thumbnail)
      embed.setThumbnail(this.thumbnail);
    return embed;
  }
  getStream() {
    return fs.createReadStream(this.path);
  }
  destroy() {
    return fs.unlink(this.path, (err) => { if(err) throw err });
  }

}

class Stream extends Audio {

  constructor(url, author) {
    super('stream', url);
    this.url = url;
    this.duration = '∞';
    this.setAuthor(author);
  }
  getEmbed() {
    return super.getEmbed(0xFAA61A) //orange for some reason
  }
  getStream() {
    const request = require('request');
    return request(this.url);
  }

}

module.exports = {
  AudioFile,
  Stream
}
