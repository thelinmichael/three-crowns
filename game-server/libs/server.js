var mongoose = require("mongoose");
var Game = require("./models/game");
var GameBuilder = require("./gamebuilder");
var io;

function GameServer(options) {
  this.running = false;
}

GameServer.prototype.start = function(stopCallback, port, options) {

  this.stopCallback = stopCallback;

  mongoose.connect('mongodb://localhost/game');

  io =  require('socket.io').listen(port, options);
  this.running = true;

  io.sockets.on('connection', function (socket) {

    socket.emit('connection', { status: 'success' });

    socket.on('create', function(options) {
      GameBuilder.create(options);
      socket.emit('create', { status : 'success' });
    });

    socket.on('server-status', function() {
      var status = {};
      Game.find({}).exec(function(err, games) {
        status.numberOfGames = games.length;
        status.games = games;
        socket.emit('server-status', status);
      });
    });

    socket.on('ping', function() {
      socket.emit('pong', { message : 'pong!'});
    });

  });
};

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

GameServer.prototype.isRunning = function() {
  return this.running;
};

exports = module.exports = GameServer;