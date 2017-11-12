const fs = require('fs');
const Logger = require('./logger.js');
const { cache, getGuildValue } = require('./dataEngine.js');
const LocaleEngine = require('./localeEngine.js');
const { ownerid } = require('../config.json');

const commandsMaps = new Map();

module.exports = {
  getCommandMap,
  buildCommandsMap,
  commandsMaps,
  checkPermissions
}

let commands = [];
const categories = [];
const info = require('./commands/info');
const control = require('./commands/control');
categories.push(info);
categories.push(control);
commands = commands.concat(info.commands);
commands = commands.concat(control.commands);

cache.forEach((guild, key) => {
  const getKey = getGuildValue(guild);
  const locale = getKey('locale');
  const prefix = getKey('prefix');
  buildCommandsMap(locale, prefix);
});

function getCommandMap(guild) {
  const getKey = getGuildValue(guild);
  const locale = getKey('locale');
  const prefix = getKey('prefix');
  return commandsMaps.get(locale + prefix).map;
}

function buildCommandsMap(locale, prefix) {
  const index = locale + prefix;
  if(commandsMaps.has(index)) {
    commandsMaps.get(index).guildsUsing += 1;
    return;
  }
  const map = new Map();
  for(const command of commands) {
    const commandPrefix = (command.prefix === 'mention')
     ? '<@!?${clientid}>\\s*'
     : command.prefix || prefix;
    const localeVariants =
      LocaleEngine.getCommandData(locale, command).variants || [];
    const variants = command.variants.concat(localeVariants);
    const variantsString = variants.map(escapeString).join('|');
    const regExpSource =
      `^${escapeString(commandPrefix)}(${variantsString})(?:\\s|$)(.*)`;
    map.set(new RegExp(regExpSource, 'i'), command);
  }
  commandsMaps.set(index, {map, guildsUsing: 1});
}

function checkPermissions(message, command) {
  const member = message.member;
  const perms = command.permissions;
  if(!perms) return true;
  const ownerindex = perms.indexOf('OWNER');
  if(ownerindex > -1) {
    if(member.id != ownerid) return false;
    perms.splice(ownerindex, 1);
  }
  if(!member.hasPermission(perms)) return false;
  return true;
}

function escapeString(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
