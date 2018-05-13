const { cache, getGuildValue, getRow } = require('./dataEngine.js');
const { getCommandData } = require('./localeEngine.js');
const { ownerID } = require('../credentials.json');

const commandsMaps = new Map();

const categories = [];
const commands = [];

module.exports.categories = categories;
module.exports.commands = commands;

const info = require('./commands/info');
const control = require('./commands/control');
const search = require('./commands/search');
categories.push(info, control, search);
commands.push(...info.commands, ...control.commands, ...search.commands)


const getCommandMap = guild => {
  const getKey = getGuildValue(guild);
  const locale = getKey('locale');
  const prefix = getKey('prefix');
  return commandsMaps.get(locale + prefix).map;
}

const buildCommandsMap = (locale, prefix) => {
  const index = locale + prefix;
  if (commandsMaps.has(index)) {
    commandsMaps.get(index).guildsUsing += 1;
    return;
  }
  const map = new Map();
  for(const command of commands) {
    const commandPrefix = (command.prefix === 'mention')
     ? '<@!?${clientid}>\\s*'
     : command.prefix || prefix;
    const localeVariants = getCommandData(locale, command).variants || [];
    const variants = command.variants.concat(localeVariants);
    const variantsString = variants.map(escapeString).join('|');
    const regExpSource = `^${escapeString(commandPrefix)}(${variantsString})(?:\\s|$)(.*)`;
    map.set(new RegExp(regExpSource, 'i'), command);
  }
  commandsMaps.set(index, {map, guildsUsing: 1});
}

const checkPermissions = (message, command) => {
  const member = message.member;
  const perms = command.permissions;
  if (!perms)
    return true;
  const ownerindex = perms.indexOf('OWNER');
  if (ownerindex > -1) {
    if (member.id !== ownerID)
      return false;
    perms.splice(ownerindex, 1);
    if (perms.length === 0)
      return true;
  }
  if (!member.hasPermission(perms))
    return false;
  return true;
}

const escapeString = str => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

cache.get('guilds').forEach((guild, key) => {
  const getKey = getGuildValue(guild);
  const locale = getKey('locale');
  const prefix = getKey('prefix');
  buildCommandsMap(locale, prefix);
});

module.exports = {
  getCommandMap,
  buildCommandsMap,
  commandsMaps,
  checkPermissions,
  categories,
  commands
}
