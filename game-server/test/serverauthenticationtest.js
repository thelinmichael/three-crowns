var mongoose = require("mongoose");
var io = require('socket.io-client');
var should = require('should');
var GameServer = require('../libs/server');

var server = new GameServer();

var socket;

describe("Websocket authentication", function() {

  this.timeout(5000);

  beforeEach(function(done) {
    server.start(null, 8090, { log : false });

    /* Connect to MongoDB */
    mongoose.connection.once("open", function() {
      mongoose.connection.db.dropDatabase(function(err) {
        done(err);
      });
    });
  });

  afterEach(function(done) {
    /* Disconnect MongoDB and the Websocket connection */
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) return done(err);
      socket.disconnect();
      server.stop();
      done();
    });
  });

  it("should not be able to connect without authentication", function(done) {
    socket = io.connect('http://localhost:8090', { 'force new connection' : true });
    socket.on('error', function(reason) {
      done();
    });
    socket.on('connect', function(data) {
      assert.fail('should not have been able to connect');
    });
  });

});