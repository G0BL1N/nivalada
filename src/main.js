const Discord = require('discord.js');
const Config = require('../config.json');
const Queues = require('./queues.js');
const checkPermissions = require('./permissionchecker.js');
const Client = new Discord.Client();

var commands;
var initiated = false;

module.exports.Client = Client;

Client.on('ready', () => {
  console.log('Client ready.');
  if(initiated) return;
  module.exports.Queues = new Queues(Client);
  console.log('Queues initialized.');
  commands = require('./commands.js');
  console.log('Commands initialized.');
});

Client.on('message', (message) => {
  if(message.author.bot) return;
  loop:
  for(let command of commands) {
    for(let variant of command.variants) {
      let prefix = command.prefix;
      let cmd = (prefix ? prefix : '') + variant;
      let regexp = buildRegExp(cmd);
      if(message.content.match(regexp)) {
        if(!checkPermissions(message, command)) {
          message.channel.sendMessage(':warning: У вас недостаточно прав для' +
          'использования этой команды.');
          return;
        }
        //console.log should be changed
        console.log(`${message.author.username}(${message.member.nickname || ''}) initiated ${cmd}`)
        command.action(message);
        break loop;
      }
    }
  }
});

function buildRegExp(str) {
    let escaped = str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp('^' + escaped + '(\\s|$)');
}

Client.login(Config.token)
  .then(result => console.log('Logged in successfully.'))
  .catch((error) => {
    console.error('Cannot log in, error:\n' + error);
    process.exit(0);
});

process.on('exit', Client.destroy);
process.on('SIGINT', () => {
  Client.destroy();
  process.exit(0);
});
