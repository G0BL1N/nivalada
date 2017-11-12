const Discord = require('discord.js');
const config = require('../config.json');
const DataEngine = require('./dataEngine.js');
const CommandEngine = require('./commandEngine.js');
const logger = require('./logger.js');
const { getGuildString: l } = require('./localeEngine.js');

const Client = new Discord.Client()

Client.on('ready', () => {
  logger.log('Client ready.');
});

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
    let [, variant, args] = result;
    command.action(message, args, variant);
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
