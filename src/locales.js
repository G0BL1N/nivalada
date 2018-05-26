const fs = require('fs');
const { getGuildValue } = require('./data.js')
const defaults = require('../defaults.json');

const locales = {};
const localeFoldersPath = __dirname + '../../locales/';
const localeFolders = fs.readdirSync(localeFoldersPath);

localeFolders.forEach((locale) => {
  const commands = require(localeFoldersPath + locale + '/commands.json');
  const strings = require(localeFoldersPath + locale + '/strings.json');
  locales[locale] = { commands, strings };
});

const getCommandData = (locale, command) => {
  return locales[locale].commands[command.variants[0]];
}

const getGuildString = guild => (stringName, ...values) => {
  const locale = getGuildValue(guild)('locale');
  const string = locales[locale].strings[stringName];
  if (!string)
    return stringName;
  return string.replace(/{(\d+)}/g, (match, number) => (
    values[number] !== undefined ? values[number] : match
  ));
}

const getGuildCommand = guild => command => {
  const locale = getGuildValue(guild)('locale');
  const result = locales[locale].commands[command];
  if (!result)
    return { description: 'no_description' };
  return result;
}

module.exports = {
  getCommandData,
  getGuildString,
  getGuildCommand,
  locales
}
