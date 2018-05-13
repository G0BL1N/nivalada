const fs = require('fs');
const { getGuildValue } = require('./dataEngine.js')
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
  return string.replace(/{(\d+)}/g, (match, number) => (
    values[number] !== undefined ? values[number] : match
  ));
}

const getGuildCommand = guild => command => {
  const locale = getGuildValue(guild)('locale');
  return locales[locale].commands[command];
}

module.exports = {
  getCommandData,
  getGuildString,
  getGuildCommand,
  locales
}
