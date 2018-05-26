const { cache, getGuildValue, getRow } = require('./data.js');
const { getCommandData } = require('./locales.js');
const { ownerID } = require('../credentials.json');

const commandsMaps = new Map();
const categories = [];
const commands = [];
const commandsPaths = [];

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
    const localeCommandData = getCommandData(locale, command);
    const variants = (localeCommandData && localeCommandData.variants)
      ? command.variants.concat(localeCommandData.variants)
      : command.variants;
    const variantsString = variants.map(escapeString).join('|');
    const regExpSource = `^${escapeString(commandPrefix)}(${variantsString})(?:\\s|$)(.*)`;
    map.set(new RegExp(regExpSource, 'i'), command);
  }
  commandsMaps.set(index, {map, guildsUsing: 1});
}

const buildAllCommandsMaps = () => {
  commandsMaps.clear();
  cache.get('guilds').forEach((guild, key) => {
    const getKey = getGuildValue(guild);
    const locale = getKey('locale');
    const prefix = getKey('prefix');
    buildCommandsMap(locale, prefix);
  });
}

const loadCommands = () => {
  const { info, control, search, music } = require('./commands/');
  categories.push(info, control, search, music);
  commands.push(
    ...info.commands,
    ...control.commands,
    ...search.commands,
    ...music.commands
  );

  commandsPaths.push(`./commands/`);
  categories.forEach(({ name, commands }) => {
    commandsPaths.push(`./commands/${name}/`);
    commands.forEach(({ variants }) => {
      commandsPaths.push(`./commands/${name}/${variants[0]}.js`);
    });
  });
}

const reloadCommands = () => {
  commandsPaths.forEach((path) => {
    delete require.cache[require.resolve(path)];
  });
  categories.length = 0;
  commands.length = 0;

  loadCommands();
  buildAllCommandsMaps();
}

module.exports.reloadCommands = reloadCommands;
module.exports.buildCommandsMap = buildCommandsMap;
module.exports.commandsMaps = commandsMaps;
module.exports.categories = categories;
module.exports.commands = commands;

loadCommands();


const getCommandMap = guild => {
  const getKey = getGuildValue(guild);
  const locale = getKey('locale');
  const prefix = getKey('prefix');
  return commandsMaps.get(locale + prefix).map;
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

buildAllCommandsMaps()

module.exports = {
  getCommandMap,
  buildCommandsMap,
  commandsMaps,
  checkPermissions,
  categories,
  commands,
  reloadCommands
}
