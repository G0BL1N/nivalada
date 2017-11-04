const CommandEngine = require('../../commandEngine.js');
const DataEngine = require('../../dataEngine.js');
const l = require('../../localeEngine.js');

module.exports = {
  variants: ['setlocale'],
  usage: 'setlocale',
  async action(message, args) {
    if(!(args in l.locales)) return;
    CommandEngine.updateLocale(message.guild, args);
  }
}
