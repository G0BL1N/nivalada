const Discord = require('discord.js');
const config = require('../config.json');
const voiceHandler = require('./voiceHandler.js');
const commandHandler = require('./commandHandler.js');
const logger = require('./logger');

const Client = new Discord.Client();

module.exports = Client;

var ready = false;

Client.on('ready', () => {
  if(ready) return;
  voiceHandler.init(Client);
  commandHandler.init();
  ready = true;
});

Client.on('message', (message) => {
  if(message.author.bot) return;
  let command = commandHandler.findCommandPrefix(message.content);
  if(!command) return;
  if(!commandHandler.checkPermissions(message, command)) {
    message.channel.sendMessage(':warning: У вас недостаточно прав для ' +
    'использования этой команды.');
    return;
  }
  //console.log should be changed
  console.log(`${message.author.username}(${message.member.nickname || ''}) initiated ${command.variants[0]}`)
  command.action(message);
  return;
});

Client.login(config.token)
  .then(result => logger.log('Logged in successfully.'))
  .catch((error) => {
    logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
});

process.on('exit', Client.destroy);
