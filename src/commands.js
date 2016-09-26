const fs = require('fs');
const commands = [];
const PATH = __dirname + '/commands/';

let filenames = fs.readdirSync(PATH);

for(let filename of filenames) {
  load(require(PATH + filename));
}

function load(category) {
  for(let command of category.commands) {
    command.category = category.name;
    commands.push(command);
  }
}

module.exports = commands;
