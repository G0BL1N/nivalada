const chalk = require('chalk');
const moment = require('moment');

const log = (...info) => {
  const str = `${chalk.bgGreen(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

const error = (...info) => {
  const str = `${chalk.bgRed(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

const warn = (...info) => {
  const str = `${chalk.bgYellow(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

const command = (message) =>  {
  const guildName = '[' + message.guild.name + ']';
  const tag = message.author.tag;
  const str = `${chalk.bgBlue(getTime() + chalk.black(guildName))} ${chalk.magenta(tag)} initiated ${message}`;
  console.log(str);
}

function getTime() {
  return chalk.black('[' + moment().format('YYYY-MM-DD/kk:mm') + ']');
}

module.exports = {
  log,
  error,
  warn,
  command
}
