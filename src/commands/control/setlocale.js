const { commandsMaps, buildCommandsMap } = require('../../commands.js');
const { updateTableData, getGuildValue } = require('../../data.js');
const { getGuildString, locales } = require('../../locales.js');

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
    if (commandsMaps.has(key)) {
      const commandsMap = commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if (commandsMap.guildsUsing == 0) commandsMaps.delete(key);
    }
    buildCommandsMap(locale, oldPrefix);
    updateTableData('guilds')({ id: guild.id, locale });
    message.channel.send(l('setlocale_done', locale));
  }
}
