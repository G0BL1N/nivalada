const Discord = require('discord.js');
const config = require('../config.json');
const DataEngine = require('./dataEngine.js')
const CommandEngine = require('./commandEngine.js')
const Logger = require('./logger.js')

const Client = new Discord.Client()



Client.on('ready', () => {
  Logger.log('Client ready.');
});


Client.on('message', async (message) => {
  const map = await CommandEngine.getRegExpMap(message.guild);
  for(const [regExp, command] of map) {
    const result = regExp.exec(message);
    if(!result) continue;
    let [, variant, args] = result;
    command.action(message, args, variant);
    Logger.command(message);
    break;
  }
});


Client.login(config.token)
  .then(result => Logger.log('Logged in successfully.'))
  .catch((error) => {
    Logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
});
