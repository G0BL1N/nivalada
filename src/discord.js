const Discord = require('discord.js');
const { token } = require('../credentials.json');
const CommandEngine = require('./commandEngine.js');
const logger = require('./logger.js');
const { getGuildString } = require('./localeEngine.js');

const Client = new Discord.Client()

Client.on('ready', () => {
  logger.log('Client ready.');
});

let blTimeouts = {};

Client.on('message', async (message) => {
  const map = CommandEngine.getCommandMap(message.guild);
  const entries = map.entries();
  for(const [regExp, command] of map) {
    const result = regExp.exec(message);
    if(!result) continue;
    const hasPerms = CommandEngine.checkPermissions(message, command);
    if(!hasPerms) {
      message.channel.send(l(message.guild)('no_permissions'));
      break;
    }
    const blReason = CommandEngine.isBlacklisted(message.author);
    if(blReason != false) {
      if(blTimeouts[message.author.id]) return;
      const l = getGuildString(message.guild);
      message.channel.send(l('blacklisted', blReason));
      blTimeouts[message.author.id] = setTimeout(() => {
        blTimeouts[message.author.id] = undefined;
      }, 6000000);
      return;
    }
    let [, variant, arg] = result;
    command.action(message, arg, variant);
    logger.command(message);
    break;
  }
});

Client.login(token)
  .then(result => logger.log('Logged in successfully.'))
  .catch((error) => {
    logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
});
