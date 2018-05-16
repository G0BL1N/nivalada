module.exports = {
  name: 'music',
  commands: [
    require('./queue.js'),
    require('./skip.js')
  ]
};
