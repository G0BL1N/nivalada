const data = require('./data.js');
const cleanup = require('./cleanup.js');

cleanup.register();

(async () => {
  await data.init();
  require('./discord.js');
})();
