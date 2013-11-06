require(["gameeventhandler"], function(gameeventhandler) {
  var socket = io.connect('http://localhost:8090');

    socket.on('connection', function (data) {
      console.log(data);
      socket.emit('games', {});
    });

    socket.on('games', function(data) {
      console.log(data);
      if (data.games) {
        console.log("there are " + data.games.length + " games");
      }
    });
});