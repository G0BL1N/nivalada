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
  for(let key in commands) {
    let command = commands[key];
    for(let variantKey in command.variants) {
      let prefix = command.prefix;
      let variant = command.variants[variantKey];
      let cmd = (prefix ? prefix : '') + variant;
      if(message.content.indexOf(cmd) == 0) {
        command.action(message);
        break;
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
