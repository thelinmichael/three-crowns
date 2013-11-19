var mongoose = require("mongoose");
var Game = require("./models/game.js");
var io;

function GameServer(options) {
}

GameServer.prototype.start = function(stopCallback, port, options) {

  this.stopCallback = stopCallback;

  mongoose.createConnection('mongodb://localhost/game');

  io = require('socket.io').listen(port, options);

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
        sendServerStatus();
      });
    });

    socket.on('server-status', function() {
      sendServerStatus();
    });
  });

};

GameServer.prototype.stop = function() {
  if (this.stopCallback) {
    this.stopCallback();
  }
};

var sendServerStatus = function() {
  var status = {};
  Game.find({}).exec(function(err, games) {
    status.numberOfGames = games.length;
    status.games = games;
    socket.emit('server-status', status);
  });
};

exports = module.exports = GameServer;