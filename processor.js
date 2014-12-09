/*
 * processor.js
 */
var MailParser = require('mailparser').MailParser,
    request = require('request'),
    config = require('config'),
    roomModel = require("./room"),
    logger = require("./logger")();


module.exports = function(callback){
  var mailparser = new MailParser();

  logger.debug("start to send notification to hubot");

  mailparser.on("end", function(mail){
    var err;

    logger.debug(mail);

    if (!mail.text || !mail.headers) {
      var err = new Error("cancelled unexpected mail format");
      logger.error(err);
      callback(err);
      return;
    }

    var room = roomModel.getDest(mail.headers["x-original-to"]);
    if (!room) {
      var err = new Error("cancelled not to set delivery to room");
      logger.error(err);
      callback(err);
      return;
    }

    var msg = "";
    if (room.mention) {
      msg = room.mention + " ";
    }
    msg += mail.subject + "\n" + mail.text;

    var data = {
      from   : mail.headers.from,
      room   : room.id,
      message: msg
    };

    logger.debug(data);

    request({
        method: "POST",
        uri   : config.notifyUrl,
        form  : data
      },
      function(err, response, body){
        if (err) {
          logger.error(err);
          callback(err);
        } else if (body == "OK") {
          logger.info("sended to " + data.room + " from " + data.from);
          callback();
        }
      });
  });

  return mailparser;
}
