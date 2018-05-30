const { getImageColor } = require('../../utils.js');
const { MessageEmbed } = require('discord.js');
const rp = require('request-promise-native');
const { getGuildString } = require('../../locales.js');
const { googleAPIKey, googleSearchEngineID } =
  require('../../../credentials.json');
const logger = require('../../logger.js');

module.exports = {
  variants: ['googleimg', 'gi'],
  usage: 'googleimg 2 anime girl',
  async action(message, arg) {
    const l = getGuildString(message.guild);
    const result = /^(\d*)\s*(.*)$/.exec(arg);
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
        q: query,
        searchType: 'image'
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
      const itemIndex = number ? Math.min(number - 1, items.length - 1) : 0;
      const image = items[itemIndex].link;
      const color = await getImageColor(image);
      const embed = new MessageEmbed()
        .setColor(color) //.setColor(0xFBBC05)
        .setImage(image);
      const reply = await pending;
      reply.edit(embed);
    } catch (err) {
      logger.warn('Google search error:' + err);
      const reply = await pending;
      reply.edit(l('error'));
    }
  }
}
