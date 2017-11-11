const CommandEngine = require('../../commandEngine.js');
const {cache, updateGuildData, getGuildValue} = require('../../dataEngine.js');
const defaults = require('../../../defaults.json');
const l = require('../../localeEngine.js');

module.exports = {
  variants: ['setlocale'],
  usage: 'setlocale',
  async action(message, args) {
    if(!(args in l.locales)) return;
    const locale = args;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldLocale = getValue('locale');
    const oldPrefix = getValue('prefix');
    if(locale == oldLocale) return;
    const key = oldLocale + oldPrefix;
    if(CommandEngine.commandsMaps.has(key)) {
      const commandsMap = CommandEngine.commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if(commandsMap.guildsUsing == 0) {
        CommandEngine.commandsMaps.delete(key);
      }
    }
    CommandEngine.buildCommandsMap(locale, oldPrefix);
    updateGuildData(guild)({locale});
  }
}
