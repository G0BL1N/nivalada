const Client = require('../main.js');

const prefix = Client.config.prefix;

module.exports = {
  name: ':8ball: Полезное',
  commands: [
    {
      prefix: prefix,
      variants: ['8ball','ball','шар'],
      description: 'Шар судьбы, что тут ещё можно сказать?',
      usage: prefix + 'шар Стоит ли покодить?',
      async action(message, args) {
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
        let answer = answers[Math.floor(Math.random() * answers.length)];
        message.channel.sendMessage(`:8ball: ${answer}`);
      }
    },
    {
      prefix: prefix,
      variants: ['choose', 'выбери', 'выбор'],
      description: 'Выбирает вариант из предложенных, разделённых `;`.',
      usage: prefix+'выбери спать;смотреть аниме;кодить',
      async action(message, args) {
        let answers = args.split(';');
        let answer = answers[Math.floor(answers.length * Math.random())];
        message.channel.sendMessage(':white_check_mark: ' +
        `Правильным выбором будет: "**${answer}**".`);
      }
    },
    {
      prefix: prefix,
      variants: ['purge'],
      description: 'Удаляет указанное количество сообщений из данного канала.',
      usage: prefix+'bulk 5',
      permissions: ['MANAGE_MESSAGES'],
      async action(message, args) {
        let num = parseInt(args);
        if(!num || num < 1) return;
        message.channel.bulkDelete(num);
      }
    },
  ],
}
