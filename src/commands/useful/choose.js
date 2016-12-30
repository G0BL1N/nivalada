module.exports = {
  variants: ['choose', 'выбери', 'выбор'],
  description: 'Выбирает вариант из предложенных, разделённых `;`.',
  usage: 'выбери спать;смотреть аниме;кодить',
  async action(message, args) {
    let answers = args.split(';');
    let answer = answers[Math.floor(answers.length * Math.random())];
    message.channel.send(':white_check_mark: ' +
    `Правильным выбором будет: "**${answer}**".`);
  }
}
