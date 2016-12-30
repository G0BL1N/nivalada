const { RichEmbed } = require('discord.js');
const commandHandler = require('../../commandHandler.js');

module.exports = {
  variants: ['help', 'h'],
  description: 'Список команд или поиск по команде.',
  usage: 'help info',
  async action(message, args) {
    if(!args) {
      message.channel.sendEmbed(commandHandler.helpEmbed);
      return;
    }
    let cmd = commandHandler.findCommand(args);
    let prefix = cmd.prefix === 'mention' ? '@BotName' : cmd.prefix;
    let reply =  `Помощь по команде \`${cmd.variants[0]}\`:\n` +
      `**Описание**: ${cmd.description}\n` +
      `**Использование**: \`${prefix}${cmd.usage}\`\n` +
      `**Варианты** : \`${cmd.variants.join('\`;\`')}\``;
    message.channel.send(reply);
  }
}
