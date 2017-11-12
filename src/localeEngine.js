const fs = require('fs');
const DataEngine = require('./dataEngine.js')
const defaults = require('../defaults.json');

const locales = {};
const localeFoldersPath = __dirname + '../../locales/';
const localeFolders = fs.readdirSync(localeFoldersPath);

localeFolders.forEach((locale) => {
  const commands = require(localeFoldersPath + locale + '/commands.json');
  const strings = require(localeFoldersPath + locale + '/strings.json');
  locales[locale] = { commands, strings };
})

function getCommandData(locale, command) {
  return locales[locale].commands[command.variants[0]];
}

const getGuildString = guild => (stringName, ...values) => {
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

module.exports = {
  getCommandData,
  getGuildString,
  locales
}
