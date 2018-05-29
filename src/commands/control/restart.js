const { getGuildString } = require('../../locales.js');
const { reloadCommands } = require('../../commands.js');

module.exports = {
  variants: ['restart'],
  usage: 'restart',
  permissions: ['OWNER'],
  async action(message) {
    const l = getGuildString(message.guild);
    process.emit('uexit');
  }
}
