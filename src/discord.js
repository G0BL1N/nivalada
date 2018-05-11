const Discord = require('discord.js');
const { token } = require('../credentials.json');
const CommandEngine = require('./commandEngine.js');
const logger = require('./logger.js');
const { getGuildString } = require('./localeEngine.js');

const Client = new Discord.Client()

Client.on('ready', () => logger.log('Client ready.'));

Client.on('message', async (message) => {
  const commandMap = CommandEngine.getCommandMap(message.guild);
  const entries = [...commandMap.entries()];
  const result = entries.find(([regExp]) =>
    message.content.search(regExp) != -1
  );
  if (result === undefined) return;
  const [regExp, command] = result;
  const [, variant, arg] = regExp.exec(message);
  const hasPerms = CommandEngine.checkPermissions(message, command);
  if (!hasPerms) {
    message.channel.send(l(message.guild)('no_permissions'));
    return;
  }
  command.action(message, arg, variant);
  logger.command(message);
});

Client.login(token)
  .then(result => logger.log('Logged in successfully.'))
  .catch((error) => {
    logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
});
