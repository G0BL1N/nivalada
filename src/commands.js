const commands = [];

load(require('./commands/info.js'));
load(require('./commands/music.js'));
load(require('./commands/talk.js'));
load(require('./commands/useful.js'));

function load(category) {
  for(let key in category.commands) {
    let command = category.commands[key];
    command.category = category.name;
    commands.push(command);
  }
}

module.exports = commands;
