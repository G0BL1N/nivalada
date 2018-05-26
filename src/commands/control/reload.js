const { getGuildString } = require('../../locales.js');
const { reloadCommands } = require('../../commands.js');

module.exports = {
  variants: ['reload'],
  usage: 'reload',
  permissions: ['OWNER'],
  async action(message) {
    const l = getGuildString(message.guild);
    reloadCommands();
  }
}
