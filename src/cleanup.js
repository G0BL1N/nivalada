const fse = require('fs-extra');
const logger = require('./logger.js');
const { queues, leave } = require('./music.js');


const leaveChannels = () => {
  logger.warn('Leaving all channels...');
  queues.forEach(queue => {
    if (queue.connection)
      leave(queue);
  });
}

const cleanup = async () => {
  logger.warn('Cleaning up...');
  await fse.emptyDir('./cache/');
}

const exit = async () => {
  leaveChannels();
  await cleanup();
  logger.warn('Shutting down...');
  process.exit();
}

const register = () => {
  process.once('uexit', exit);

  process.once('SIGHUP', exit);

  process.once('SIGINT', exit);

  process.once('uncaughtException', async (err) => {
    logger.error('Uncaught Exception!\n' + err.stack);
    await exit();
  });
}

module.exports = {
  cleanup,
  register
}
