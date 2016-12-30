const { RichEmbed } = require('discord.js');

module.exports = {
  variants: ['status', 'stats'],
  description: 'Статус бота.',
  usage: 'status',
  async action(message) {

    let ms = message.client.uptime;
    let days      = Math.floor(ms / (24*60*60*1000));
    let daysms    = ms % (24*60*60*1000);
    let hours     = Math.floor((daysms)/(60*60*1000));
    let hoursms   = ms % (60*60*1000);
    let minutes   = Math.floor((hoursms)/(60*1000));

    let memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    let uptime = `\`${days}\` дней, ` +
      `\`${hours}\` часов, \`${minutes}\` мин`;
    const embed = new RichEmbed()
      .setColor(0x36d148)
      .addField('Использование памяти', `${memory} MB`, true)
      .addField('Онлайн', uptime, true)
      .addField('\u200b', '\u200b', true)
      .addField('Сервера', message.client.guilds.size, true)
      .addField('Каналы', message.client.channels.size, true)
      .addField('Пользователи', message.client.users.size, true);
    message.channel.sendEmbed(embed);
  }
}
