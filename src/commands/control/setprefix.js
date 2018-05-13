const CommandEngine = require('../../commandEngine.js');
const { updateTableData, getGuildValue } = require('../../dataEngine.js');
const { getGuildString } = require('../../localeEngine.js');

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
    if (CommandEngine.commandsMaps.has(key)) {
      const commandsMap = CommandEngine.commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if (commandsMap.guildsUsing == 0)
        CommandEngine.commandsMaps.delete(key);
    }
    CommandEngine.buildCommandsMap(oldLocale, prefix);
    updateTableData('guilds')({ id: guild.id, prefix });
    message.channel.send(l('setprefix_done', prefix));
  }
}
