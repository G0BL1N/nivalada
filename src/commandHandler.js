const fs = require('fs');
const config = require('../config.json');
const PATH = __dirname + '/commands/';
const commands = [];
const categories = [];

module.exports = {
  init,
  commands,
  categories,
  findCommand,
  findCommandPrefix,
  findCategory,
  checkPermissions
}

function init() {
  let filenames = fs.readdirSync(PATH);
  for(let filename of filenames) {
    load(require(PATH + filename));
  }
}

function load(category) {
  categories.push(category);
  for(let command of category.commands) {
    command.category = category.name;
    commands.push(command);
  }
}
function findCommand(query) {
  return commands.find((cmd) => {
    for(let variant of cmd.variants) {
      let regexp = buildRegExp(variant);
      if(query.match(regexp)) {
        return true;
        break;
      }
    }
  });
}
function findCommandPrefix(query) {
  return commands.find((cmd) => {
    for(let variant of cmd.variants) {
      let regexp = buildRegExp(cmd.prefix + variant);
      if(query.match(regexp)) {
        return true;
        break;
      }
    }
  });
}

function findCategory(query) {
  return categories.find(ctg => ctg.name.startsWith(query));
}

function buildRegExp(str) {
    let escaped = str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp('^' + escaped + '(\\s|$)');
}

function checkPermissions(message, command) {
  let perms = command.permissions;
  if(!perms) return true;
  let ownerPermIndex = perms.indexOf('OWNER');
  let trustedPermIndex = perms.indexOf('TRUSTED');
  let member = message.member;
  let channel = message.channel;
  if(ownerPermIndex > -1) {
    perms.splice(ownerPermIndex, 1);
    if(trustedPermIndex > -1) perms.splice(trustedPermIndex, 1);
    if(member.id === config.ownerid &&
    channel.permissionsFor(member).hasPermissions(perms)) return true;
    else return false;
  }
  if(trustedPermIndex > -1) {
    perms.splice(trustedPermIndex, 1);

    if((member.id === config.ownerid || member.id === config.trustedids) &&
    channel.permissionsFor(member).hasPermissions(perms)) return true;
    else return false;
  }
  if(channel.permissionsFor(member).hasPermissions(perms)) return true;
  else return false;
}
