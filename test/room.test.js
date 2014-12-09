/*
 * room.test.js
 */

process.env.NODE_CONFIG_DIR = __dirname + '/config';
process.env.NODE_ENV = 'test1';

var assert = require('assert');
var room = require("../room");

describe('#getDest', function(){

  describe('valid configuration', function(){
    it('returns room', function(){
      assert.deepEqual(room.getDest("all@example.com"), { id: "#all" });
      assert.deepEqual(room.getDest("admin@example.com"), { id: "admin.room@example.com", mention: "@all" });
      assert.equal(room.getDest("none@example.com"), null);
    })
  });

});
