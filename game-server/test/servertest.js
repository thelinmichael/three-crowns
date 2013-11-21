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

  before(function(done) {
    server.start(null, 8090, { log : false});
    if (mongoose.connection.db) {
        return done();
    } else {
      mongoose.connect('mongodb://localhost/game', done);
    }
  });

  beforeEach(function(done) {
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);

      socket = io.connect('http://localhost:8090', { 'force new connection' : true });
      socket.on('connect', function(data) {
        done();
      });

    });
  });

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

    var expectedGames = 0;
    socket.on('server-status', function(status) {
      should.exist(status);
      should.exist(status.numberOfGames);
      status.numberOfGames.should.equal(expectedGames);

      if(expectedGames == 1) {
        done();
      }
    });

    // Creating two new games
    Game.create({}, function(err) {
      if (err) assert.fail("Could not create game");
      expectedGames++;
    });

    socket.on('create', function(create) {
      should.exist(create);
      (true).should.equal(create.success);
    });
  });

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

  after(function() {
    server.stop();
  });

});