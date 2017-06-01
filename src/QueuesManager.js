const Queue = require('./Queue.js');

class QueuesManager {

  constructor() {
    this.container = {};
  }
  getQueue(guildid) {
    if(guildid in this.container)
      return this.container[guildid];

    return this.newQueue(guildid);
  }
  newQueue(guildid) {
    this.container[guildid] = new Queue();
    return this.container[guildid];
  }
  removeQueue(guildid) {
    if(!guildid in this.container) return;

    let queue = this.container[guildid];
    queue.leave();
    delete this.container[guildid];
  }
  reinitQueue(guildid) {
    this.removeQueue(guildid);
    return this.newQueue(guildid);
  }

}

module.exports = new QueuesManager();
