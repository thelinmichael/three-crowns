var PORT = 8090;

var io = require('socket.io').listen(PORT);

io.sockets.on('connection', function (socket) {
  socket.emit('connection', { hello: 'world' });
});
