const dbEngine = require('./dataEngine.js');

dbEngine.init()
  .then(() => {
    require('./discord.js');
  });
