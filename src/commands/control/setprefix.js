const { commandsMaps, buildCommandsMap } = require('../../commands.js');
const { updateTableData, getGuildValue } = require('../../data.js');
const { getGuildString } = require('../../locales.js');

module.exports = {
  variants: ['setprefix'],
  usage: 'setprefix ~',
  permissions: ['ADMINISTRATOR'],
  async action(message, arg) {
    if (!arg) {
      message.channel.send(l('setprefix_no_prefix'));
      return;
    }
    const l = getGuildString(message.guild);
    const prefix = arg;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldPrefix = getValue('prefix');
    if (prefix == oldPrefix) {
      message.channel.send(l('setprefix_same_prefix'));
      return;
    }
    const oldLocale = getValue('locale');
    const key = oldLocale + oldPrefix;
    if (commandsMaps.has(key)) {
      const commandsMap = commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if (commandsMap.guildsUsing == 0) commandsMaps.delete(key);
    }
    buildCommandsMap(oldLocale, prefix);
    updateTableData('guilds')({ id: guild.id, prefix });
    message.channel.send(l('setprefix_done', prefix));
  }
}
