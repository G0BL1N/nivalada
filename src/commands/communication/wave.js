module.exports = {
  prefix: '',
  variants: ['/o/', '\\o\\'],
  description: '/o/ \\o\\ /o/ \\o\\',
  usage: '/o/',
  async action(message, args, variant) {
    if(variant === '/o/')
      message.channel.send('\\o\\');
    else
      message.channel.send('/o/');
  }
};
