const fs = require('fs');
const DataEngine = require('./dataEngine.js')
const defaults = require('../defaults.json');

const locales = {};
const localeFoldersPath = __dirname + '../../locales/';
const localeFolders = fs.readdirSync(localeFoldersPath);

for(const locale of localeFolders) {
  const commands = require(localeFoldersPath + locale + '/commands.json');
  const strings = require(localeFoldersPath + locale + '/strings.json');
  locales[locale] = {};
  locales[locale].commands = commands;
  locales[locale].strings = strings;
}

module.exports = {
  getCommandData,
  getString,
  locales
}

function getCommandData(locale, command) {
  return locales[locale].commands[command.variants[0]];
}

function getString(guild, stringName, ...values) {
  let locale = defaults.locale;
  const cache = DataEngine.cache;
  const guildData = cache.get(guild.id);
  if(guildData && guildData.locale)
    locale = guildData.locale;
  const string = locales[locale].strings[stringName];
  return string.replace(/{(\d+)}/g, (match, number) => {
    return values[number] || match;
  });
}
