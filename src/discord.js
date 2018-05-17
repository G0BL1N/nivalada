const Discord = require('discord.js');
const { token } = require('../credentials.json');
const commands = require('./commands.js');
const logger = require('./logger.js');
const { getGuildString } = require('./locales.js');

const Client = new Discord.Client()

Client.on('ready', () => logger.log('Client ready.'));

Client.on('message', async (message) => {
  const commandMap = commands.getCommandMap(message.guild);
  const entries = [...commandMap.entries()];
  const result = entries.find(([regExp]) => (
    message.content.search(regExp) != -1
  ));
  if (result === undefined) return;
  const [regExp, command] = result;
  const [, variant, arg] = regExp.exec(message);
  const hasPerms = commands.checkPermissions(message, command);
  if (!hasPerms) {
    message.channel.send(l(message.guild)('no_permissions'));
    return;
  }
  logger.command(message);
  command.action(message, arg, variant);
});

(async () => {
  try {
    await Client.login(token);
    logger.log('Logged in successfully.')
  } catch (err) {
    logger.error('Cannot log in, error:\n' + error);
    process.exit(0);
  }
})();
