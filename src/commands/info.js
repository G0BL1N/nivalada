const {RichEmbed} = require('discord.js');
const commandHandler = require('../commandHandler.js');
const {prefix} = require('../../config.json');

module.exports = {
  name: ':information_source: Инфо',
  commands: [
    {
      prefix: prefix,
      variants: ['help', 'h'],
      description: 'Список команд или поиск по команде.',
      usage: prefix + 'help info',
      async action(message, args) {
        if(!args) {
          message.channel.sendEmbed(commandHandler.helpEmbed);
          return;
        }
        let cmd = commandHandler.findCommand(args);
        let reply =  `Помощь по команде \`${cmd.variants[0]}\`:\n` +
          `**Описание**: ${cmd.description}\n` +
          `**Использование**: ${cmd.usage}\n` +
          `**Варианты** : \`${cmd.variants.join('\`;\`')}\``;
        message.channel.sendMessage(reply);
      }
    },
    {
      prefix: prefix,
      variants: ['status', 'stats'],
      description: 'Статус бота.',
      usage: prefix + 'status',
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
    },
    {
      prefix: prefix,
      variants: ['uptime', 'up', 'аптайм'],
      description: 'Показывает аптайм.',
      usage: prefix + 'uptime',
      async action(message) {
        let ms = message.client.uptime;
        let days      = Math.floor(ms / (24*60*60*1000));
        let daysms    = ms % (24*60*60*1000);
        let hours     = Math.floor((daysms)/(60*60*1000));
        let hoursms   = ms % (60*60*1000);
        let minutes   = Math.floor((hoursms)/(60*1000));
        let minutesms = ms % (60*1000);
        let sec = Math.floor((minutesms)/(1000));
        message.channel.sendMessage(`Онлайн: \`${days}\` дней, `+
          `\`${hours}\` часов, \`${minutes}\` минут, \`${sec}\` секунд.`);
      }
    },
    {
      prefix: prefix,
      variants: ['userid', 'uid'],
      description: 'Выводит id указанного пользователя.',
      usage: prefix + 'userid @Man',
      async action(message) {
        if(message.mentions.users.size == 0) return;
        let user = message.mentions.users.first();
        message.channel.sendMessage(`\`${user.id}\``);
      }
    },
    {
      prefix: prefix,
      variants: ['getavatar', 'avatar'],
      description: 'Выводит ссылку на аватар указанного пользователей.',
      usage: prefix + 'getavatar @Dude',
      async action(message) {
        if(message.mentions.users.size == 0) return;
        let user = message.mentions.users.first();
        message.channel.sendMessage(user.avatarURL);
      }
    },
  ],
};
