var assert = require('assert');
var mongoose = require("mongoose");
var io = require('socket.io-client');
var should = require('should');

var Game = require('../libs/models/game');

var GameServer = require('../libs/server');
var server = new GameServer();

var socket;

describe("Websocket API", function() {

  this.timeout(5000);

  beforeEach(function(done) {
    server.start(null, 8090, { log : false });

    mongoose.connection.once("open", function() {
      mongoose.connection.db.dropDatabase(function(err){
        if (err) return done(err);
        socket = io.connect('http://localhost:8090', { 'force new connection' : true });
        socket.on('connect', function(data) {
          done();
        });
      });
    });
  });

  afterEach(function() {
    socket.disconnect();
    server.stop();
  });

  it("should be able to connect", function() {
    if (!(socket && socket.socket && socket.socket.connected)) {
      assert.fail("Could not connect");
    }
  });

  it("should be able to ping server", function(done) {
    socket.emit('ping', {});
    socket.on('pong', function(pong) {
      should.exist(pong);
      should.exist(pong.message);
      pong.message.should.equal("pong!");
      done();
    });
  });

});