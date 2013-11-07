var io = require('socket.io').listen(8090);
var mongoose = require("mongoose");
var Game = require("./models/game.js");

mongoose.connect('mongodb://localhost/game');

io.sockets.on('connection', function (socket) {
  socket.emit('connection', { status: 'success' });

  socket.on('games', function(data) {
    Game.find(function (err, games) {
      if (err) {
        throw new Error("Could not fetch games from database");
      } else {
        socket.emit('games', { 'games' : games });
      }
    });
  });

});