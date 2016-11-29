const config = require('../config.json');

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

    if((member.id === config.ownerid || config.trustedids) &&
    channel.permissionsFor(member).hasPermissions(perms)) return true;
    else return false;
  }
  if(channel.permissionsFor(member).hasPermissions(perms)) return true;
  else return false;
}
module.exports = checkPermissions;
