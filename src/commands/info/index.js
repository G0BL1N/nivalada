module.exports = {
  name: 'info',
  commands: [
    require('./ping.js'),
    require('./status.js'),
    require('./help.js'),
  ]
};
