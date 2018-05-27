const fse = require('fs-extra');
const logger = require('./logger.js');

const cleanup = async () => {
  logger.warn('Cleaning up...');
  await fse.emptyDir('./cache/');
}

const exit = async () => {
  await cleanup();
  process.exit();
}

const register = () => {

  process.once('SIGUSR1', async () => {
    await exit();
  });

  process.once('SIGUSR2', async () => {
    await exit();
  });

  process.once('SIGINT', async () => {
    await exit();
  });

  process.once('uncaughtException', async (err) => {
    logger.error('Uncaught Exception!\n' + e.stack);
    await exit();
  });
}

module.exports = {
  cleanup,
  register
}
