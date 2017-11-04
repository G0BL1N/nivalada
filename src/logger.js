const chalk = require('chalk');
const moment = require('moment');


class Logger {
  log(...info) {
    let str = `${chalk.bgGreen(this.getTime())} ${chalk.white(info)}`;
    console.log(str);
  }
  error(...info) {
    let str = `${chalk.bgRed(this.getTime())} ${chalk.white(info)}`;
    console.log(str);
  }
  warn(...info) {
    let str = `${chalk.bgYellow(this.getTime())} ${chalk.white(info)}`;
    console.log(str);
  }
  command(message) {
    let guildName = '[' + message.guild.name + ']';
    let tag = message.author.tag;
    let str = `${chalk.bgBlue(this.getTime() + chalk.black(guildName))} ${chalk.magenta(tag)} initiated ${message}`;
    console.log(str);
  }
  getTime() {
    return chalk.black('[' + moment().format('YYYY-MM-DD/kk:mm') + ']');
  }
}

module.exports = new Logger();
