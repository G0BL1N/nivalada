const { RichEmbed } = require('discord.js');

module.exports = {
  variants: ['serverlist', 'serverls'],
  description: 'Список серверов.',
  usage: 'serverlist',
  permissions: ['TRUSTED'],
  async action(message) {
    const guilds = message.client.guilds.array();
    const columnSize = Math.ceil(guilds.length/3);

    const embed = new RichEmbed()
      .setColor(0x36d148)
      .setTitle('Список серверов');
    let str = '';
    let counter = 0;
    for(const guild of guilds) {
      counter += 1;
      str += `**${guild.name}**`;
      if(counter === columnSize || counter === guilds.length) {
        embed.addField('\u200b', str, true);
        counter = 0;
        str = '';
      } else {
        str += '\n';
      }
    }
    message.channel.sendEmbed(embed);
  }
}
