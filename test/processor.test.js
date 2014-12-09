/*
 * processor.test.js
 */

process.env.NODE_CONFIG_DIR = __dirname + '/config';
process.env.NODE_ENV = 'test1';

var fs = require('fs');
var assert = require('assert');
var nock = require('nock');
var processor = require("../processor");


describe('processor', function(){

  describe('piped valid format gmail', function(){
    it("sends notification", function(done){
      var scope = nock('http://localhost:8080')
                   .post('/hubot/notify', {
                      from: "Some One <someone@example.com>",
                      room: "admin.room@example.com",
                      message: "@all テストメール\nユニットテスト用の\nメールを送信する。\n"
                    }).reply(200, "OK");

      fs.createReadStream(__dirname + '/mail/gmail.mail').pipe(processor(done));
    })
  });

  describe('piped valid format cron mail', function(){
    it("sends notification", function(done){
      var scope = nock('http://localhost:8080')
                   .post('/hubot/notify', {
                      from: '"root" <root@example.com>',
                      room: "#all",
                      message: "Cron <root@host> env\nLANGUAGE=ja_JP:ja\nHOME=/root\nMAILTO=temp@example.info\nLOGNAME=root\nPATH=/usr/bin:/bin\nLANG=ja_JP.UTF-8\nSHELL=/bin/sh\nPWD=/root\n"
                    }).reply(200, "OK");

      fs.createReadStream(__dirname + '/mail/cron.mail').pipe(processor(done));
    })
  });

  describe('piped undefined delivery room', function(){
    it("occurs error", function(done){
      function callback(err){
        assert.equal(err.message, "cancelled not to set delivery to room");
        done();
      }

      fs.createReadStream(__dirname + '/mail/undelivery-cron.mail').pipe(processor(callback));
    })
  });

  describe('piped invalid format mail', function(){
    it("occurs error", function(done){
      function callback(err){
        assert.equal(err.message, "cancelled unexpected mail format");
        done();
      }

      fs.createReadStream(__dirname + '/mail/invalid-cron.mail').pipe(processor(callback));
    })
  });

});
