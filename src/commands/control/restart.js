module.exports = {
  variants: ['exit', 'restart'],
  description: 'Выключает бота. Если был запущен через forever то будет перезагружен.',
  usage: 'exit',
  permissions: ['TRUSTED'],
  action(message) {
    throw new Error('reboot');
  }
}
