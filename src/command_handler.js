const fs = require('fs');
const PATH = __dirname + '/commands/';
const commands = [];
const categories = [];
let filenames = fs.readdirSync(PATH);

module.exports = {
  commands,
  categories,
  findCommand,
  findCommandPrefix,
  findCategory
}

for(let filename of filenames) {
  load(require(PATH + filename));
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
