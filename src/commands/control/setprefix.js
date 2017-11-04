const CommandEngine = require('../../commandEngine.js');
const DataEngine = require('../../dataEngine.js');

module.exports = {
  variants: ['setprefix'],
  usage: 'setprefix',
  async action(message, args) {
    CommandEngine.updatePrefix(message.guild, args);
  }
}
