const rp = require('request-promise-native');
const { getGuildString } = require('../../locales.js');
const { googleAPIKey, googleSearchEngineID } =
  require('../../../credentials.json');
const logger = require('../../logger.js');

module.exports = {
  variants: ['google', 'gg'],
  usage: 'google 2 anime',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const result = /^(\d*)\s+(.*)$/.exec(arg);
    const channel = message.channel;
    if (!result) {
      channel.send(l('no_query'));
      return;
    }
    const pending = channel.send(l('searching'));
    const [, number, query] = result;
    const options = {
      uri: 'https://www.googleapis.com/customsearch/v1',
      qs: {
        key: googleAPIKey,
        cx: googleSearchEngineID,
        q: query
      },
      json: true
    }
    try {
      const { items } = await rp(options);
      if (!items) {
        const reply = await pending;
        reply.edit(l('not_found'));
        return;
      }
      const itemIndex = number ? Math.max(number - 1, items.length - 1) : 0;
      const reply = await pending;
      reply.edit(items[itemIndex].link);
    } catch (err) {
      logger.warn('Google search error:' + err);
      const reply = await pending;
      reply.edit(l('error'));
    }
  }
}
