/*
 * room.js
 */
var config = require('config');


exports.getDest = function(toField){
  var dest = toField;
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
