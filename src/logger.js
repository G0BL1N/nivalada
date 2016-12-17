
const fs = require('fs');



class Logger {
  log(str) {
    console.log(str);
  }
}
module.exports = new Logger();
