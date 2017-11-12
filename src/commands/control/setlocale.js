const CommandEngine = require('../../commandEngine.js');
const {cache, updateGuildData, getGuildValue} = require('../../dataEngine.js');
const defaults = require('../../../defaults.json');
const { getGuildString, locales } = require('../../localeEngine.js');

module.exports = {
  variants: ['setlocale'],
  usage: 'setlocale',
  permissions: 'ADMINISTRATOR',
  async action(message, args) {
    const l = getGuildString(message.guild);
    if(!(args in locales))
      return message.channel.send(l('setlocale_no_locale'));
    const locale = args;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldLocale = getValue('locale');
    const oldPrefix = getValue('prefix');
    if(locale == oldLocale)
      return message.channel.send(l('setlocale_same_locale'));
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
    message.channel.send(l('setlocale_done', locale));
  }
}
