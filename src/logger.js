const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
const Console = require('console').Console;

const output = fs.createWriteStream('./log.log', {flags: 'a'});
const errorOutput = fs.createWriteStream('./stderr.log', {flags: 'a'});
fileConsole = new Console(output, errorOutput);

module.exports.log = function(...info) {
  let m = `[${moment().format()}]`;
  let str = `${chalk.bgGreen(m)} ${chalk.grey(info)}`;
  console.log(str);
  fileConsole.log(str);
}

module.exports.command = function(message) {
  let m = `[${moment().format()}]`;
  let name =  message.member.displayName;
  let disc = message.author.discriminator;
  let id = message.author.id;
  let displayname = chalk.magenta(name + '#' +disc) + '[' + chalk.grey(id) + ']';
  let str = `${chalk.bgGreen(m)} ${displayname} initiated "${chalk.grey(message)}"`;
  let fdisplayname = `${name}#${disc}[${id}]`;
  let fstr = `${m} ${fdisplayname} initiated "${message}"`;
  console.log(str);
  fileConsole.log(fstr);
}

module.exports.error = function(err) {
  let m = `[${moment().format()}]`;
  let str = `${chalk.red(m)} ${err}`;
  console.log(str);
  fileConsole.error(str);
}
