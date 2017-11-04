const r = require('rethinkdb');
const Logger = require('./logger.js');
const dbconfig = require('../dbconfig.json');

class DataEngine {
  constructor() {
    this.getConnection();
    this.cache = this.loadCache();
  }
  async getConnection() {
    if(this.connection) return this.connection;
    let connection;
    try {
      connection = await r.connect(dbconfig);
      await r.tableCreate('guilds').run(connection);
    } catch(err) {
      if(err.msg != 'Table `zeroone.guilds` already exists.') {
        Logger.error('Error connecting to database:\n' + err);
        process.exit(1);
      }
    }
    this.connection = connection;
    return this.connection;
  }
  async loadCache() {
    const connection = await this.getConnection();;
    const cursor = await r.table('guilds').run(connection);
    const cache = new Map();

    await cursor.eachAsync((guild) => {
      cache[guild.id] = guild;
    }).catch(this.handleError);
    cache.set('defaults', require('../defaults.json'));
    return cache;
  }
  getCache() {
    return this.cache;
  }
  async getGuildSetting(guild, key) {
    await this.getConnection();
    if(this.cache.has(guild.id))
      return this.cache.get(guild.id).get(key)
          || this.cache.get('defaults').get(key);
    this.cache.get('defaults').get(key);
  }
  async updateGuildData(guild, data) {
    const connection = await this.getConnection();
    data.id = guild.id;
    r.table('guilds').insert(data, {conflict: 'update'} )
      .run(connection).catch(this.handleError);
    this.cache[guild.id] = Object.assign(this.cache[guild.id] || {}, data);
  }
  handleError(err) {
    if(!err) return;
    Logger.error('Rethinkdb error:\n' + err);
  }
}


module.exports = new DataEngine();
