const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
const Console = require('console').Console;

class Logger {
  constructor() {
    const output = fs.createWriteStream('./log.log', {flags: 'a'});
    const errorOutput = fs.createWriteStream('./stderr.log', {flags: 'a'});
    this.console = console;
    this.fileConsole = new Console(output, errorOutput);
  }
  log(...info) {
    let m = `[${moment().format()}]`;
    let str = `${chalk.bgGreen(m)} ${chalk.grey(info)}`;
    this.console.log(str);
    this.fileConsole.log(str);
  }
  command(message) {
    let m = `[${moment().format()}]`;
    let name =  message.member.displayName;
    let disc = message.author.discriminator;
    let id = message.author.id;
    let displayname = chalk.magenta(name + '#' +disc) + '[' + chalk.grey(id) + ']';
    let str = `${chalk.bgGreen(m)} ${displayname} initiated "${chalk.grey(message)}"`;
    let fdisplayname = `${name}#${disc}[${id}]`;
    let fstr = `${m} ${fdisplayname} initiated "${message}"`;
    this.console.log(str);
    this.fileConsole.log(fstr);
  }
  error(err) {
    let m = `[${moment().format()}]`;
    let str = `${chalk.red(m)} ${err}`;
    this.console.log(str);
    this.fileConsole.error(str);
  }
}

module.exports = new Logger();
