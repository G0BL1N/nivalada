const fs = require('fs');
const Logger = require('./logger.js');
const DataEngine = require('./dataEngine.js')
const LocaleEngine = require('./localeEngine.js')
const config = require('../config.json');

class CommandEngine {
  constructor() {
    module.exports = this;
    this.commands = [];
    this.regExpMaps = new Map();
    const catFoldersPath = __dirname + '/commands/';
    const catFolders = fs.readdirSync(catFoldersPath);
    for(const catFolder of catFolders) {
      const catPath = catFoldersPath + catFolder + '/';
      const category = require(catPath + '_index.js');
      const commandFiles = fs.readdirSync(catPath);
      for(const commandFile of commandFiles) {
        if(commandFile === '_index.js') continue;
        const command = new Command(catPath + commandFile, category);
        this.commands.push(command);
      }
    }
    this.buildAllRegExpMaps();
  }
  async getRegExpMap(guild) {
    const cache = await DataEngine.getCache();
    let locale = 'ru';
    let prefix = config.prefix;
    if(cache[guild.id]) {
        locale = cache[guild.id].locale || locale;
        prefix = cache[guild.id].prefix || prefix;
    }
    return this.regExpMaps.get(locale + prefix).map;
  }
  async buildAllRegExpMaps() {
    this.buildRegExpMap('ru', config.prefix);
    const cache = await DataEngine.getCache();
    for(const guildid in cache) {
      const locale = cache[guildid].locale || 'ru';
      const prefix = cache[guildid].prefix || config.prefix;
      this.buildRegExpMap(locale, prefix);
    }
  }
  async buildRegExpMap(locale, prefix) {
    if(this.regExpMaps.has(locale + prefix)) {
      this.regExpMaps.get(locale + prefix).guildsUsing += 1;
      return;
    }
    const map = new Map();
    for(const command of this.commands) {
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
    this.regExpMaps.set(locale + prefix, {map, guildsUsing: 1});
  }
  async updatePrefix(guild, prefix) {
    const cache = await DataEngine.getCache();
    let oldLocale = 'ru';
    let oldPrefix = config.prefix;
    if(cache[guild.id]) {
        oldLocale = cache[guild.id].locale || oldLocale;
        oldPrefix = cache[guild.id].prefix || oldPrefix;
    }
    if(prefix == oldPrefix)
      return;
    const key = oldLocale + oldPrefix;
    if(this.regExpMaps.has(key)) {
      this.regExpMaps.get(key).guildsUsing -= 1;
      if(this.regExpMaps.get(key).guildsUsing == 0)
        this.regExpMaps.delete(key);
    }
    this.buildRegExpMap(oldLocale, prefix);
    DataEngine.updateGuildData(guild, {prefix});
  }
  async updateLocale(guild, locale) {
    const cache = await DataEngine.getCache();
    let oldLocale = 'ru';
    let oldPrefix = config.prefix;
    if(cache[guild.id]) {
        oldLocale = cache[guild.id].locale || oldLocale;
        oldPrefix = cache[guild.id].prefix || oldPrefix;
    }
    if(locale == oldLocale)
      return;
    const key = oldLocale + oldPrefix;
    if(this.regExpMaps.has(key)) {
      this.regExpMaps.get(key).guildsUsing -= 1;
      if(this.regExpMaps.get(key).guildsUsing == 0)
        this.regExpMaps.delete(key);
    }
    this.buildRegExpMap(locale, oldPrefix);
    DataEngine.updateGuildData(guild, {locale});
  }
}
class Command {
  constructor(path, category) {
    Object.assign(this, require(path));
    this.category = category;
  }
}

function escapeString(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = new CommandEngine();
