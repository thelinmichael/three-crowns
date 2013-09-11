var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile('/index.html');
});

/* Business logic */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var gameSchema = mongoose.Schema({
    start: Date,
    end : Date
});
var Game = mongoose.model('Game', gameSchema);

var playerSchema = mongoose.Schema({
    name: String
});
var Player = mongoose.model('Player', playerSchema);

/* Controllers */
io.sockets.on('connection', function(socket) {
  socket.emit('connection-attempt', { status: 'success' });

  socket.on('join', function(user) {
    var player = new Player({ name : user.name });
    player.save(function(err) {
      if (err) {
        console.log(err);
         socket.emit("join", { status : "failed"});
      } else {
        console.log("Created player " + user.name);
        socket.emit("join", { status : "success"});
        Player.count({}, function(err, count) {
          if (err) {
            console.log(err);
          } else {
            console.log("Number of players: " + count);
          }
        });
      }
    });
  });

  socket.on('leave', function(user) {
    Player.remove({ name : user.name }, function(err) {
      if (err) {
        console.log(err)
        socket.emit("leave", { status : "failed"});
      } else {
        console.log("Removed player " + user.name);
        socket.emit("leave", { status : "success"});
        Player.count({}, function(err, count) {
          if (err) {
            console.log(err);
          } else {
            console.log("Number of players: " + count);
          }
        })
      }
    });
  });

});