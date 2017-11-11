const r = require('rethinkdb');
const logger = require('./logger.js');
const dbconfig = require('../dbconfig.json');
const defaults = require('../defaults.json');
const cache = new Map();
let connection;

async function init() {
  try {
    connection = await r.connect(dbconfig);
    await r.tableCreate('guilds').run(connection);
  } catch(err) {
    if(err.msg != 'Table `zeroone.guilds` already exists.') {
      logger.error('Error connecting to database:\n' + err);
      process.exit(1);
    }
  }
  const cursor = await r.table('guilds').run(connection);

  await cursor.eachAsync((guild) => {
    cache.set(guild.id, guild);
  }).catch(handleError);
}

const getGuildValue = guild => key => {
  const guildCache = cache.get(guild.id);
  if(guildCache && guildCache[key])
    return guildCache[key];
  return defaults[key];
}

const updateGuildData = guild => data => {
  cache.set(guild.id, Object.assign(cache.get(guild.id) || {}, data));
  data.id = guild.id;
  r.table('guilds').insert(data, {conflict: 'update'} )
    .run(connection).catch(this.handleError);
}

function handleError() {
  if(!err) return;
  logger.error('Rethinkdb error:\n' + err);
}

module.exports = {
  init,
  getGuildValue,
  updateGuildData,
  cache,
  defaults
}
