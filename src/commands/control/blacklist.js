const CommandEngine = require('../../commandEngine.js');
const { updateTableData } = require('../../dataEngine.js');
const { getGuildString } = require('../../localeEngine.js');

module.exports = {
  variants: ['blacklist'],
  usage: 'blacklist @username reason',
  permissions: ['OWNER'],
  async action(message, arg) {
    const regExp = /<@!?(\d+)>\s(.+)/i;
    const result = regExp.exec(arg);
    if(!result) return false;
    const [, userid, reason] = result;
    const l = getGuildString(message.guild);
    const mentioned = message.mentions.users.first;
    if(mentioned.id !== userid) {
      message.channel.send(l('blacklist_no_user', user));
      return;
    };
    updateTableData('blacklist')( {id: userid, reason} );
    message.channel.send(l('blacklist_done', user, reason));
  }
}
