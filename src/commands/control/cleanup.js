const fs = require('fs');

module.exports = {
  variants: ['cleanup'],
  description: 'Очищает кэш.',
  usage: 'cleanup',
  permissions: ['OWNER'],
  action(message, args) {
    const FOLDERPATH = '../../../cache/'
    const filenames = fs.readdirSync(FOLDERPATH);
    for(const filename of filenames) {
      fs.unlink(FOLDERPATH + filename, function(err) {
        if(err) {
          throw err;
        }
      });
    }
  }
}
