var ko = require('../vendor/knockout-3.0.0.js');
var viewModels = require('./viewmodels/viewmodels');

ko.applyBindings(viewModels.Status);

// Move all these actions to some other module.
var socket = io.connect('http://localhost:8090');

socket.on('connection', function (data) {
  socket.emit('server-status', {});
});

socket.on('server-status', function(status) {
  viewModels.Status.numberOfGames(status.numberOfGames);
  viewModels.Status.games(status.games);
});

// TODO: Move this away to some module or use a framework.
document.getElementById("createGame").onclick = function() {
  socket.emit('create', {});
}