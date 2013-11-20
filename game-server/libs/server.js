var mongoose = require("mongoose");
var Game = require("./models/game.js");
var io;

function GameServer(options) {
  this.running = false;
}

GameServer.prototype.start = function(stopCallback, port, options) {

  this.stopCallback = stopCallback;

  mongoose.createConnection('mongodb://localhost/game');

  io = require('socket.io').listen(port, options);
  this.running = true;

  io.sockets.on('connection', function (socket) {

    socket.emit('connection', { status: 'success' });

    socket.on('create', function() {
      Game.create({}, function(err) {
        var params;
        if (err) {
          params = {
            error : true
          };
        } else {
          params = {
            success : true
          };
        }
        socket.emit('create', params);
        sendServerStatus(socket);
      });
    });

    socket.on('server-status', function() {
      sendServerStatus(socket);
    });

    socket.on('ping', function() {
      socket.emit('pong', { message : 'pong!'});
    });
  });
};

GameServer.prototype.stop = function() {
  var that = this;
  io.server.close(function() {
    that.running = false;
    if (this.stopCallback) {
      this.stopCallback();
    }
  });
};

GameServer.prototype.isRunning = function() {
  return this.running;
};

var sendServerStatus = function(socket) {
  var status = {};
  Game.find({}).exec(function(err, games) {
    status.numberOfGames = games.length;
    status.games = games;
    socket.emit('server-status', status);
  });
};

exports = module.exports = GameServer;