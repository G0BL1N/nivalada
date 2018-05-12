const CommandEngine = require('../../commandEngine.js');
const { updateTableData, getGuildValue } = require('../../dataEngine.js');
const { getGuildString, locales } = require('../../localeEngine.js');

module.exports = {
  variants: ['setlocale'],
  usage: 'setlocale en',
  permissions: ['ADMINISTRATOR'],
  async action(message, arg) {
    const l = getGuildString(message.guild);
    if (!(arg in locales)) {
      message.channel.send(l('setlocale_no_locale'));
      return;
    }
    const locale = arg;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldLocale = getValue('locale');
    if (locale == oldLocale) {
      message.channel.send(l('setlocale_same_locale'));
      return;
    }
    const oldPrefix = getValue('prefix');
    const key = oldLocale + oldPrefix;
    if (CommandEngine.commandsMaps.has(key)) {
      const commandsMap = CommandEngine.commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if (commandsMap.guildsUsing == 0) {
        CommandEngine.commandsMaps.delete(key);
      }
    }
    CommandEngine.buildCommandsMap(locale, oldPrefix);
    updateTableData('guilds')( {id: guild.id, locale} );
    message.channel.send(l('setlocale_done', locale));
  }
}
