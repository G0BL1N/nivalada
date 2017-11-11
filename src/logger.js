const chalk = require('chalk');
const moment = require('moment');

module.exports = {
  log,
  error,
  warn,
  command
}

function log(...info) {
  let str = `${chalk.bgGreen(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

function error(...info) {
  let str = `${chalk.bgRed(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

function warn(...info) {
  let str = `${chalk.bgYellow(getTime())} ${chalk.white(info)}`;
  console.log(str);
}

function command(message) {
  let guildName = '[' + message.guild.name + ']';
  let tag = message.author.tag;
  let str = `${chalk.bgBlue(getTime() + chalk.black(guildName))} ${chalk.magenta(tag)} initiated ${message}`;
  console.log(str);
}

function getTime() {
  return chalk.black('[' + moment().format('YYYY-MM-DD/kk:mm') + ']');
}
