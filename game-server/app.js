var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile('/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('conn', { status: 'success' });
  socket.on('conn', function (data) {
    console.log("Client confirmed connection!", data);
  });
});