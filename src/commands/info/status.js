const { RichEmbed } = require('discord.js');

module.exports = {
  variants: ['status', 'stats'],
  usage: 'status',
  async action(message) {

    const ms = message.client.uptime;
    const days      = Math.floor(ms / (24*60*60*1000));
    const daysms    = ms % (24*60*60*1000);
    const hours     = Math.floor((daysms)/(60*60*1000));
    const hoursms   = ms % (60*60*1000);
    const minutes   = Math.floor((hoursms)/(60*1000));

    const memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const uptime = `\`${days}\` дней, ` +
      `\`${hours}\` часов, \`${minutes}\` мин`;
    const embed = new RichEmbed()
      .setColor(0x36d148)
      .addField('Использование памяти', `${memory} MB`, true)
      .addField('Онлайн', uptime, true)
      .addField('\u200b', '\u200b', true)
      .addField('Сервера', message.client.guilds.size, true)
      .addField('Каналы', message.client.channels.size, true)
      .addField('Пользователи', message.client.users.size, true);
    message.channel.send('', embed);
  }
}
