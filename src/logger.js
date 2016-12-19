
const fs = require('fs');



class Logger {
  log(str) {
    console.log(str);
  }
  error(err) {
    console.error(err);
  }
}
module.exports = new Logger();
