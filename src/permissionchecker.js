const ownerid = require('../config.json').ownerid;

function checkPermissions(message, command) {
  let perms = command.permissions;
  if(!perms) return true;
  let ownerPermIndex = perms.indexOf('OWNER');
  let member = message.member;
  let channel = message.channel;
  if(ownerPermIndex > -1) {
    perms.splice(ownerPermIndex, 1);
    if(member.id === ownerid &&
    channel.permissionsFor(member).hasPermissions(perms)) return true;
    else return false;
  }
  if(channel.permissionsFor(member).hasPermissions(perms)) return true;
  else return false;
}
module.exports = checkPermissions;
