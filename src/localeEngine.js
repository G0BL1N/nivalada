const fs = require('fs');
const DataEngine = require('./dataEngine.js')

class LocaleEngine {
  constructor() {
    this.locales = {};
    const localeFoldersPath = __dirname + '../../locales/';
    const localeFolders = fs.readdirSync(localeFoldersPath);
    for(const locale of localeFolders) {
      const commands = require(localeFoldersPath + locale + '/commands.json');
      const strings = require(localeFoldersPath + locale + '/strings.json');
      this.locales[locale] = {};
      this.locales[locale].commands = commands;
      this.locales[locale].strings = strings;
    }
  }
  async getLocale(guild) {
    let locale = 'ru';
    const guildData = await DataEngine.getCache()[guild.id];
    if(guildData && guildData.locale)
      locale = guildData.locale;
    return locale;
  }
  getCommandData(locale, command) {
    return this.locales[locale].commands[command.variants[0]];
  }
  getString(guild, stringName, ...values) {
      let locale = 'ru';
      const guildData = DataEngine.cache[guild.id];
      if(guildData && guildData.locale)
        locale = guildData.locale;
      const string = this.locales[locale].strings[stringName];
      return string.replace(/{(\d+)}/g, (match, number) => {
        return values[number] || match;
      });
  }
}

module.exports = new LocaleEngine();
