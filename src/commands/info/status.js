const { RichEmbed } = require('discord.js');
const { getGuildString } = require('../../localeEngine.js');
module.exports = {
  variants: ['status', 'stats'],
  usage: 'status',
  async action(message) {
    const l = getGuildString(message.guild);
    const ms = message.client.uptime;
    const days      = Math.floor(ms / (24*60*60*1000));
    const daysms    = ms % (24*60*60*1000);
    const hours     = Math.floor((daysms)/(60*60*1000));
    const hoursms   = ms % (60*60*1000);
    const minutes   = Math.floor((hoursms)/(60*1000));

    const memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const uptime = l('uptime_string', days, hours, minutes);
    const embed = new RichEmbed()
      .setColor(0x36d148)
      .addField(l('memory_usage'), `${memory} MB`, true)
      .addField(l('uptime'), uptime, true)
      .addField('\u200b', '\u200b', true)
      .addField(l('servers'), message.client.guilds.size, true)
      .addField(l('channels'), message.client.channels.size, true)
      .addField(l('users'), message.client.users.size, true);
    message.channel.send('', embed);
  }
}
