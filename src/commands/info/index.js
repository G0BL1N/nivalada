module.exports = {
  name: 'info',
  fancyname: ':information_source: Инфо',
  commands: [
    require('./ping.js'),
    require('./status.js')
  ]
};
