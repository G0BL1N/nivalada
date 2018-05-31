const { getGuildString } = require('../../locales.js');
const logger = require('../../logger.js');

module.exports = {
  variants: ['setactivity', 'setac'],
  usage: 'setac WATCHING Anime',
  permissions: ['OWNER'],
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const result = /^([A-Za-z]+)\s+(.+)$/.exec(arg);
    const type = result && result[1];
    const name = result && result[2];
    //add type check
    if (!type || !name) {
      message.channel.send(l('setactivity_err'));
      return;
    }
    const clientUser = message.client.user;
    try {
      await clientUser.setActivity(name, { type });
      message.channel.send(l('setactivity_done'));
      logger.log('New activity has been set')
    } catch (err) {
      message.channel.send(l('error'))
      logger.warn(err);
    }
  }
}
