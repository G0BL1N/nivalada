const Discord = require('discord.js');
const Config = require('../config.json');
const Queues = require('./queues.js');
const checkPermissions = require('./permissionchecker.js');
const Client = new Discord.Client();
module.exports.Client = Client;
var initiated = false;
var handlder = null;

Client.on('ready', () => {
  console.log('Client ready.');
  if(initiated) return;
  module.exports.Queues = new Queues(Client);
  console.log('Queues initialized.');
  handler = require('./command_handler.js');
  console.log('Command handler initialized.');
});

Client.on('message', (message) => {
  if(message.author.bot) return;
  let command = handler.findCommandPrefix(message.content);
  if(!command) return;
  if(!checkPermissions(message, command)) {
    message.channel.sendMessage(':warning: У вас недостаточно прав для' +
    'использования этой команды.');
    return;
  }
  //console.log should be changed
  console.log(`${message.author.username}(${message.member.nickname || ''}) initiated ${command.variants[0]}`)
  command.action(message);
  return;
});

Client.login(Config.token)
  .then(result => console.log('Logged in successfully.'))
  .catch((error) => {
    console.error('Cannot log in, error:\n' + error);
    process.exit(0);
});

process.on('exit', Client.destroy);
