const fs = require('fs');
const spawn = require('child_process').spawn;
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

class YoutubeStream extends Audio {
  constructor(url, title, video) {
    super('ytstream', title);
    this.url = url;
    this.duration = '∞';
    this.video = video;
  }
  setThumbnail(url) {
    this.thumbnail = url;
  }
  getEmbed() {
    let embed = super.getEmbed(0xE62117) //youtube red color
    if(this.thumbnail)
      embed.setThumbnail(this.thumbnail);
    return embed;
  }
  getStream() {
    let args = [
      '-analyzeduration', '0',
      '-protocol_whitelist', 'file,pipe,http,https,tcp,tls,hls,applehttp',
      '-i', '-',
      '-vn',
      '-c:a', 'copy',
      '-f', 's16le',
      '-'
    ]
    let ffmpeg = spawn('ffmpeg', args);
    ffmpeg.on('close', console.log)
    ffmpeg.on('error', console.log)
    ffmpeg.on('message', console.log)
    ffmpeg.on('exit', console.log)

    ffmpeg.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    this.video.pipe(ffmpeg.stdin);
    return ffmpeg.stdout;
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
  YoutubeStream,
  Stream
}
