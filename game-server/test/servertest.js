var assert = require('assert');
var mongoose = require("mongoose");
var io = require('socket.io-client');
var should = require('should');

var Game = require('../libs/models/game');

var GameServer = require('../libs/server');
var server = new GameServer();

var socket;

describe.only("Websocket API", function() {

  this.timeout(5000);

  beforeEach(function(done) {
    server.start(null, 8090, { log : false });

    mongoose.connection.once("open", function() {
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) return done(err);
        socket = io.connect('http://localhost:8090', { 'force new connection' : true });
        socket.on('connect', function(data) {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) return done(err);
      socket.disconnect();
      server.stop();
      done();
    });
  });

  it("should be able to connect", function() {
    if (!(socket && socket.socket && socket.socket.connected)) {
      assert.fail("Could not connect");
    }
  });


  /**
   *  Commands tested: ping, server-status, find-games
   */
  describe("Server status", function() {

    /* ping */
    it("should be able to ping server", function(done) {
      socket.emit('ping', {});
      socket.once('pong', function(pong) {
        should.exist(pong);
        should.exist(pong.message);
        pong.message.should.equal("pong!");
        done();
      });
    });

    /* server-status */
    it("should be able to get games count", function(done) {
      Game.find({}).exec(function(err,games) {
        var actualNumberOfGames = games.length;

        socket.emit('server-status', {});
        socket.once('server-status', function(status) {
          (status.numberOfGames).should.equal(actualNumberOfGames);

          Game.create({}, function(err) {
            socket.emit('server-status', {});
            socket.once('server-status', function(status) {
              (status.numberOfGames).should.equal(actualNumberOfGames + 1);
              done();
            });
          });
        });
      });
    });

    /* find-games */
    it("should be able to find all games", function(done) {
      Game.create({}, function(error, game) {
        should.not.exist(error);

        socket.emit('find-games', {});
        socket.once('find-games', function(response) {
          should.exist(response.games);
          response.games.length.should.equal(1);
          response.games[0]._id.should.equal(game.id);
          done();
        });
      });
    });

  });

  /**
   * Commands tested: create
   */
  describe("Creating new games", function() {

    it("should be able to create games", function(done) {
      Game.find({}).exec(function(err, games) {
        var numberOfGames = games.length;
        socket.emit('create', {});
        socket.once('create', function(response) {
          response.status.should.equal('success');
          should.exist(response.gameId);

          Game.find({}).exec(function(err, games) {
            games.length.should.equal(1);
            games[0].id.should.equal(response.gameId);
            done();
          });
        });
      });
    });

  });

  /**
   * Commands tested: join
   */
  describe("Joining and leaving game", function() {

    it("should be able to join a game", function(done) {

      Game.create({}, function(err) {

        Game.find({}).exec(function(err, games) {
          games.length.should.equal(1);
          var mygame = games[0];

          socket.emit('addplayer', { gameId : mygame.id, player : { name : 'Michael' }});
          socket.once('addplayer', function(response) {
            response.status.should.equal('success');
            response.players.length.should.equal(1);
            response.players[0].player.name.should.equal('Michael');
            Game.findById(mygame.id, function(error, game) {
              game.getPlayers()[0].player.name.should.equal('Michael');
              done();
            });
          });
        });

      });
    });

  });

});