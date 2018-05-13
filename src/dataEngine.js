const r = require('rethinkdb');
const logger = require('./logger.js');
const dbconfig = require('../dbconfig.json');
const defaults = require('../defaults.json');

const cache = new Map();

let connection;

async function init() {
  try {
    connection = await r.connect(dbconfig);
    await r.dbCreate(dbconfig.db).run(connection);
    await r.tableCreate('guilds').run(connection);
  } catch (err) {
    if (err.msg.search('already exists') == -1) {
      logger.error('Error connecting to database:\n' + err);
      process.exit(1);
    }
  }
  logger.log('Connected to database.');
  try {
    await r.db('nivalada')
    .tableList()
    .map((table) => ({
        name: table,
        documents: r.db('nivalada').table(table).coerceTo('array')
    }))
    .run(connection)
    .reduce((cache, { name, documents }) => {
      const table = documents.reduce((table, document) => (
        table.set(document.id, document)
      ), new Map());
      cache.set(name, table);
    }, cache);
  } catch (err) {
    handleError(err);
  }
  cache.get('guilds').set('defaults', defaults);
  return;
}

const getRow = table => id => {
  if (!(cache.has(table) && cache.get(table).has(id))) return undefined;
  return cache.get(table).get(id);
};

const getGuildValue = guild => key => {
  const guildId = typeof(guild) === "string" ? guild : guild.id;
  const row = cache.get('guilds').get(guildId);
  if (row && row[key]) return row[key];
  return defaults[key];
}

const updateTableData = table => data => {
  let oldData = {};
  let tableObject = cache.get(table);
  if (!tableObject) {
    cache.set(table, new Map());
    tableObject = cache.get(table);
  }
  else if (tableObject.has(data.id))
    oldData = tableObject.get(data.id);
  const newData = Object.assign(oldData, data);
  tableObject.set(data.id, newData);
  r.table(table).insert(data, { conflict: 'update' })
    .run(connection).catch(this.handleError);
}

function handleError(err) {
  if (!err) return;
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
