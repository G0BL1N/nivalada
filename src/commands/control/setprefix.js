const CommandEngine = require('../../commandEngine.js');
const { updateTableData, getGuildValue } = require('../../dataEngine.js');
const { getGuildString } = require('../../localeEngine.js');

module.exports = {
  variants: ['setprefix'],
  usage: 'setprefix ~',
  permissions: ['ADMINISTRATOR'],
  async action(message, arg) {
    if(!arg) return false;
    const l = getGuildString(message.guild);
    const prefix = arg;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldLocale = getValue('locale');
    const oldPrefix = getValue('prefix');
    if(prefix == oldPrefix)
      return message.channel.send(l('setprefix_same_prefix'));;
    const key = oldLocale + oldPrefix;
    if(CommandEngine.commandsMaps.has(key)) {
      const commandsMap = CommandEngine.commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if(commandsMap.guildsUsing == 0) {
        CommandEngine.commandsMaps.delete(key);
      }
    }
    CommandEngine.buildCommandsMap(oldLocale, prefix);
    updateTableData('guilds')( {id: guild.id, prefix} );
    message.channel.send(l('setprefix_done', prefix));
  }
}
