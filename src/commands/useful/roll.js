module.exports = {
  variants: ['roll', 'ролл'],
  description: 'Выдаёт рандомный результат из указаного диапазона, ' +
  'или от 1 до указанного числа.',
  usage: 'ролл 20 30',
  async action(message, args) {
    if(!args) {
      let urfuckedgif =
        'https://media.giphy.com/media/3oz8xVlyQAXwnD9C2A/giphy.gif';
      message.channel.sendFile(urfuckedgif);
      return;
    }
    let [min, max] = args.split(' ');
    min = parseInt(min);
    max = parseInt(max);
    let result;
    if(min && max)
      result = Math.floor(Math.random() * (max - min + 1)) + min;
    else if(min)
      result = Math.floor(Math.random() * min) + 1;
    message.channel.send(`\`${result}\``);
  }
}
