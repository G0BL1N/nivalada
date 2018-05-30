module.exports = {
  name: 'music',
  commands: [
    require('./add.js'),
    require('./skip.js'),
    require('./move.js'),
    require('./leave.js'),
    require('./spotify.js'),
  ]
};
