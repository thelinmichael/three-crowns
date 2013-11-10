require(['/vendor/knockout-3.0.0.js', './viewmodels/viewmodels'], function(ko, viewModels) {
  var models = new viewModels();
  ko.applyBindings(models);

  // Move all these actions to some other module.
  var socket = io.connect('http://localhost:8090');

  socket.on('connection', function (data) {
    socket.emit('server-status', {});
  });

  socket.on('server-status', function(status) {
    models.numberOfGames(status.numberOfGames);
  });

  // TODO: Move this away to some module or use a framework.
  document.getElementById("createGame").onclick = function() {
    socket.emit('create', {});
  }

});