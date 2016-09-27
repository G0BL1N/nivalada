const config = require('../../config.json');
const main = require('../main.js');
const Client = main.Client;
const Queues = main.Queues;
const prefix = config.prefix;

module.exports = {
  name: 'useful',
  commands: [
    {
      prefix: prefix,
      variants: ['8ball','ball','шар'],
      description: 'Шар судьбы, что тут ещё можно сказать?',
      usage: prefix + 'шар Стоит ли покодить?',
      action(message) {
        let answers = [
          'Бесспорно.',
          'Прекалькулировано.',
          'Определённо да.',
          'Можешь быть уверен.',
          'Мне кажется — да.',
          'Вероятнее всего.',
          'Хорошие перспективы.',
          'Мой процессор говорит — да.',
          'Да.',
          'Пока не ясно, попробуй снова.',
          'Спроси позже.',
          'Тебе лучше не знать.',
          'Невозможно рассчитать.',
          'Подумай и спроси ещё раз.',
          'Даже не думай.',
          'Мой ответ — нет.',
          'По моим данным — нет.',
          'Перспективы не очень хорошие.',
          'Весьма сомнительно.',
        ];
        let content = message.content;
        let answer = answers[Math.round(Math.random() * answers.length)];
        message.channel.sendMessage(`🎱 ${answer}`);
      }
    },
    {
      prefix: prefix,
      variants: ['choose', 'выбери', 'выбор'],
      description: 'Выбирает случайный вариант из предложенных, разделённых `;`.',
      usage: prefix+'выбери спать;смотреть аниме;кодить',
      action(message) {
        let content = message.content;
        let question = content.substr(content.indexOf(' ')+1);
        let answers = question.split(';');
        let answer = answers[Math.floor(answers.length * Math.random())];
        message.channel.sendMessage(message, `✅ Правильным выбором будет: **\`${answer}\`**.`);
      }
    },
  ],
}
