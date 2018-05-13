const { RichEmbed } = require('discord.js');
const { getGuildString, getGuildCommand } = require('../../localeEngine.js');
const { getGuildValue } = require('../../dataEngine.js');
const { commands, categories } = require('../../commandEngine.js');

module.exports = {
  variants: ['help'],
  usage: 'help',
  async action(message, arg) {
    const guild = message.guild;
    const l = getGuildString(guild);
    const prefix = getGuildValue(guild)('prefix');
    if (arg) {
      const query = arg.replace(`^${prefix}`, '');
      const cmd = commands.find((command) => command.variants.includes(query));
      const [cmdName] = cmd.variants;
      const desc = getGuildCommand(guild)(cmdName).description;
      const variants = cmd.variants.join('\`;\`');
      const reply = l('help_command', cmdName, desc, prefix, cmd.usage, variants);
      message.channel.send(reply);
      return;
    }
    const embed = new RichEmbed().setTitle(l('help'));
    categories.forEach(({ name, commands }) => {
      const fieldTitle = l(name);
      const field = commands.reduce((field, { variants }) => (
        field + `\u2003\u2002• \`${variants[0]}\`\n`
      ), '\u200b');
      embed.addField(fieldTitle, field, true);
    });
    embed.addField('\u200b', l('help_usage', prefix));
    embed.setColor(0xF4B342);
    message.channel.send({ embed });
  }
}
