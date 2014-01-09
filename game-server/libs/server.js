var mongoose = require("mongoose");
var Game = require("./models/game");
var Player = require("./models/game");

var GameBuilder = require("./gamebuilder");

var express = require('express');
var server = express();

var io;

function GameServer(options) {
  this.running = false;
}

GameServer.prototype.start = function(stopCallback, port, options) {

  this.stopCallback = stopCallback;

  mongoose.connect('mongodb://localhost/game');

  io = require('socket.io').listen(server.listen(port));

  this.running = true;

  io.sockets.on('connection', function (socket) {

    socket.emit('connection', { status: 'success' });

    /**
     * create
     */
    socket.on('create', function(options) {
      new GameBuilder().build(function(err, game) {
        if (err) {
          socket.emit('create', { status : 'error', 'message' : err.message });
        } else {
          socket.emit('create', { status : 'success', gameId : game.id });
        }
      });
    });

    /**
     * server-status
     */
    socket.on('server-status', function() {
      var status = {};
      Game.find({}).exec(function(err, games) {
        status.numberOfGames = games.length;
        status.games = games;
        socket.emit('server-status', status);
      });
    });

    /*
     * ping
     */
    socket.on('ping', function() {
      socket.emit('pong', { message : 'pong!'});
    });

    /**
     * find-games
     */
    socket.on('find-games', function() {
      Game.find({}, function(err, foundGames) {
        if (err) {
          socket.emit('find-games', { status : 'error', 'message' : err.message });
        } else {
          socket.emit('find-games', { status : 'success', games : foundGames });
        }
      });
    });

    /**
     * add-player
     */
    socket.on('join', function(options) {
      var game = Game.findById(options.gameId, function(err, game) {
        if (err) {
          socket.emit('join', { status : 'error', 'join' : err.message });
        } else {
          var player = new Player(options.player);
          game.addPlayer(player);
          game.save(function(err, game) {
            if (err) {
              socket.emit('join', { status : 'error', 'join' : err.message });
            } else {
              socket.emit('join', { status : 'success', players : game.players });
            }
          });
        }
      });
    });
  });
};

/**
 * Stop the game server
 */
GameServer.prototype.stop = function() {
  var self = this;
  if (io) {
    mongoose.disconnect();
    io.server.close(function() {
      self.running = false;
      if (this.stopCallback) {
        this.stopCallback();
      }
    });
  }
};

/**
 * Check if the server is running
 * @returns {Boolean} Returns true if the server is running, otherwise false
 */
GameServer.prototype.isRunning = function() {
  return this.running;
};

exports = module.exports = GameServer;