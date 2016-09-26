const Discord = require('discord.js');
const Config = require('../config.json');
const Queues = require('./queues.js');

const Client = new Discord.Client();

var commands;

module.exports.Client = Client;

Client.on('ready', () => {
  console.log('Client ready.');
  module.exports.Queues = new Queues(Client);
  console.log('Queues initialized.');
  commands = require('./commands.js');
});

Client.on('message', (message) => {
  if(message.author.bot) return;
  loop:
  for(let command of commands) {
    for(let variant of command.variants) {
      let prefix = command.prefix;
      let cmd = (prefix ? prefix : '') + variant;
      if(message.content.toLowerCase().startsWith(cmd)) {
        if(command.category == 'control' && message.author.id != Config.ownerid) {
          //say something
          return;
        }
        command.action(message);
        console.log(`${message.author.username}(${message.member.nickname || ''}) initiated ${cmd}`)
        break loop;
      }
    }
  }
});

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
