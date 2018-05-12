const { RichEmbed } = require('discord.js');
const rp = require('request-promise-native');
const { getGuildString } = require('../../localeEngine.js');
const { googleAPIKey, googleSearchEngineID } =
  require('../../../credentials.json');
const logger = require('../../logger.js');

module.exports = {
  variants: ['googleimg', 'gi'],
  usage: 'googleimg 2 anime girl',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const result = /^(\d*)\s*(.*)$/g.exec(arg);
    const channel = message.channel;
    if (!result) {
      channel.send(l('google_no_query'));
      return;
    }
    const pending = channel.send(l('searching'));
    const [, number, query] = result;
    const encodedQuery = encodeURIComponent(query);
    const options = {
      uri: 'https://www.googleapis.com/customsearch/v1',
      qs: {
        key: googleAPIKey,
        cx: googleSearchEngineID,
        q: encodedQuery,
        searchType: 'image'
      },
      json: true
    }
    try {
      const { items } = await rp(options);
      if (!items) {
        const reply = await pending;
        reply.edit(l('google_not_found'));
        return;
      }
      const itemIndex = number ? Math.max(number - 1, items.length - 1) : 0;
      const reply = await pending;
      const embed = new RichEmbed()
        .setColor(0xfbbc05)
        .setImage(items[itemIndex].link);
      reply.edit('', embed);
    } catch (err) {
      logger.warn('Google search error:' + err);
      const reply = await pending;
      reply.edit(l('error'));
    }
  }
}
