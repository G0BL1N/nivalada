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
    if(err.msg != `Table \`${dbconfig.db}.guilds\` already exists.`) {
      logger.error('Error connecting to database:\n' + err);
      process.exit(1);
    }
  }
  logger.log('Connected to database.');
  const tables = await r.tableList().run(connection);
  const promises = tables.map(async (table) => {
    const cursor = await r.table(table).run(connection);
    cache.set(table, new Map());
    return cursor.eachAsync((row) => {
      cache.get(table).set(row.id, row);
    }).catch(handleError);
  });
  return Promise.all(promises);
}

const getRow = table => id => {
  if(!(cache.has(table) && cache.get(table).has(id))) return undefined;
  return cache.get(table).get(id);
};

const getGuildValue = guild => key => {
  const guildId = typeof(guild) == "string" ? guild : guild.id;
  const row = cache.get('guilds').get(guildId);
  if(row && row[key])
    return row[key];
  return defaults[key];
}

const updateTableData = table => data => {
  let oldData = {};
  let tableObject = cache.get(table);
  if(!tableObject) {
    cache.set(table, new Map());
    tableObject = cache.get(table);
  }
  else if(tableObject.has(data.id)) oldData = tableObject.get(data.id);
  const newData = Object.assign(oldData, data);
  tableObject.set(data.id, newData);
  r.table(table).insert(data, {conflict: 'update'} )
    .run(connection).catch(this.handleError);
}

function handleError(err) {
  if(!err) return;
  logger.error('Rethinkdb error:\n' + err);
}

module.exports = {
  init,
  getRow,
  getGuildValue,
  updateTableData,
  cache,
  defaults
}
