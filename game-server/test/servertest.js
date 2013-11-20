var assert = require('assert');
var mongoose = require("mongoose");
var io = require('socket.io-client');
var should = require('should');

var GameServer = require('../libs/server');
var server = new GameServer();

var socket;

describe("Websocket API", function() {

  before(function() {
    server.start(null, 8090, { log : false});
  });

  beforeEach(function(done) {
    socket = io.connect('http://localhost:8090', { 'force new connection' : true });
    socket.on('connect', function(data) {
      done();
    });
  });

  this.timeout(5000);

  it("should be able to connect", function() {
    if (!(socket && socket.socket && socket.socket.connected)) {
      assert.fail("Could not connect");
    }
  });

  it("should be able to ping server", function(done) {
    socket.emit('ping');
    socket.on('pong', function(pong) {
      should.exist(pong);
      should.exist(pong.message);
      "pong!".should.equal(pong.message);
      done();
    });
  });

  it("should be able to get current number of games", function(done) {
    socket.emit('server-status', { fields : 'numberOfGames' });
    socket.on('server-status', function(status) {
      should.exist(status);
      should.exist(status.numberOfGames);
      status.numberOfGames.should.equal(0);
      done();
    });
    // TODO: Connect to db, create a game, check that it increases.
  });

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

  after(function() {
    server.stop();
  });

});