const dbEngine = require('./dataEngine.js');

await dbEngine.init();
require('./discord.js');
