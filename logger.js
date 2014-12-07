var bunyan = require('bunyan'),
    config = require('config');

var log = new bunyan.createLogger(config.logger);

module.exports = function(){
  return log;
}

