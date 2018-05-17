const { getGuildString } = require('../../locales.js');
const logger = require('../../logger.js');

module.exports = {
  variants: ['setavatar', 'setav'],
  usage: 'setavatar http://link.to/avatar.png',
  permissions: ['OWNER'],
  async action(message, arg) {
    const l = getGuildString(message.guild);
    let url;
    if (arg !== '')
      url = arg;
    else if (message.attachments.size > 0)
      url = message.attachments.first().url;
    else {
      message.channel.send(l('setavatar_no_picture'));
      return false;
    }
    const clientUser = message.client.user;
    try {
      await clientUser.setAvatar(url);
      message.channel.send(l('setavatar_done'));
      logger.log('New avatar has been set')
    } catch (err) {
      message.channel.send(l('error'))
      logger.warn(err);
    }
  }
}
