const Discord = require('discord.js');
const config = require('../config.json');
const voiceHandler = require('./voiceHandler.js');
const commandHandler = require('./commandHandler.js');
const logger = require('./logger.js');

const Client = new Discord.Client();

module.exports = Client;
module.exports.config = config;

let ready = false;
let id;

Client.on('ready', () => {
  if(ready) return;
  voiceHandler.init(Client);
  commandHandler.init(Client);
  id = Client.user.id;
  ready = true;
});

Client.on('message', (message) => {
  if(message.author.bot) return;
  let content = message.content;
  let commands = commandHandler.commands;
  for(const cmd of commands) {
    let result = cmd.regexp.exec(content);
    if(!result) continue;
    let hasPermissions = commandHandler.checkPermissions(message, cmd);
    if(!hasPermissions) {
      message.channel.sendMessage(':warning: У вас недостаточно прав для' +
      'использования этой команды.');
      return;
    }
    let [, variant, args] = result;
    cmd.action(message, args, variant);
    logger.command(message);
    break;
  }
});

Client.login(config.token)
  .then(result => logger.log('Logged in successfully.'))
  .catch((error) => {
    logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
});

process.on('exit', Client.destroy);
