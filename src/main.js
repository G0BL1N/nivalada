const Discord = require('discord.js');
const config = require('../config.json');
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
  if(message.author.id == Client.user.id) return;
  loop:
  for(let key in commands) {
    let command = commands[key];
    for(let vkey in command.variants) {
      let variant = command.variants[vkey];
      let prefix = command.prefix;
      let cmd = (prefix ? prefix : '') + variant;
      if(message.content.indexOf(cmd) == 0) {
        command.action(message);
        console.log(`${message.author.username} initiated ${cmd}`)
        break loop;
      }
    }
  }
});

Client.login(config.token)
  .then(result => console.log('Logged in successfully.'))
  .catch((error) => {
    console.error('Cannot log in, error:\n' + error);
    process.exit(0);
  });
