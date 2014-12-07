var MailParser = require('mailparser').MailParser,
    mailparser = new MailParser(),
    fs = require('fs'),
    request = require('request'),
    config = require('config'),
    logger = require("./logger")();


function getRoom(mail){
  var dest = mail.headers["x-original-to"];
  var deliveryToRoom = config.deliveryToRoom;

  for (var key in deliveryToRoom) {
    var room = deliveryToRoom[key];

    if (new RegExp(key).exec(dest) != null) {
      if (typeof room === 'string') {
        return { id: room };
      } else {
        return room; 
      }
    }
  }

  return null;
}


logger.debug("start to send notification to hubot");

mailparser.on("end", function(mail){
  logger.debug(mail);

  if (!mail.text || !mail.headers) {
    logger.error("cancelled unexpected mail format");
    return;
  }

  var room = getRoom(mail);
  if (!room) {
    logger.error("cancelled not to set delivery to room");
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
      } else if (body == "OK") {
        logger.info("sended to " + data.room + " from " + data.from);
      }
    });
});

process.stdin.pipe(mailparser);
