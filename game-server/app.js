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

/* Controllers */
io.sockets.on('connection', function (socket) {
  socket.emit('connection-attempt', { status: 'success' });

  socket.on('game-status', function (data) {
    console.log("Incoming game-status", data);
    switch (data.action) {
      case "start":
        console.log("Starting game...");
        io.sockets.emit("game-status", { action : "start", status : "success" });
        break;
      case "end":
        console.log("Ending game...");
        io.sockets.emit("game-status", { action : "end", status : "success" });
        break;
    }
  });
});