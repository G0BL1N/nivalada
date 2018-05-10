module.exports = {
  name: 'control',
  fancyname: ':keyboard: Управление',
  commands: [
    require('./setlocale.js'),
    require('./setprefix.js'),
    require('./blacklist.js'),
    require('./setavatar.js')
  ]
};
