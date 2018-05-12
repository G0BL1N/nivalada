const dbEngine = require('./dataEngine.js');

(async () => {
  await dbEngine.init();
  require('./discord.js');
})();
