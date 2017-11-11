const CommandEngine = require('../../commandEngine.js');
const {cache, updateGuildData, getGuildValue} = require('../../dataEngine.js');
const defaults = require('../../../defaults.json');

module.exports = {
  variants: ['setprefix'],
  usage: 'setprefix',
  async action(message, args) {
    const prefix = args;
    const { guild } = message;
    const getValue = getGuildValue(guild);
    const oldLocale = getValue('locale');
    const oldPrefix = getValue('prefix');
    if(prefix == oldPrefix) return;
    const key = oldLocale + oldPrefix;
    if(CommandEngine.commandsMaps.has(key)) {
      const commandsMap = CommandEngine.commandsMaps.get(key);
      commandsMap.guildsUsing -= 1;
      if(commandsMap.guildsUsing == 0) {
        CommandEngine.commandsMaps.delete(key);
      }
    }
    CommandEngine.buildCommandsMap(oldLocale, prefix);
    updateGuildData(guild)({prefix});
  }
}
