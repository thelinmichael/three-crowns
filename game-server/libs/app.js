var io = require('socket.io').listen(8090, { log : false });
var mongoose = require("mongoose");
var Game = require("./models/game.js");

mongoose.connect('mongodb://localhost/game');

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

  var sendServerStatus = function() {
    var status = {};
    Game.find({}).exec(function(err, games) {
      status.numberOfGames = games.length;
      status.games = games;
      socket.emit('server-status', status);
    });
  };

});