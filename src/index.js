const data = require('./data.js');

(async () => {
  await data.init();
  require('./discord.js');
})();
