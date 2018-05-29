module.exports = {
  name: 'control',
  commands: [
    require('./setlocale.js'),
    require('./setprefix.js'),
    require('./setavatar.js'),
    require('./reload.js'),
    require('./restart.js'),
  ]
};
