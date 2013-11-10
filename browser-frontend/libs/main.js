require(['/vendor/knockout-3.0.0.js', './viewmodels/viewmodels'], function(ko, viewModels) {
  var models = new viewModels();
  ko.applyBindings(models);

  var socket = io.connect('http://localhost:8090');

    socket.on('connection', function (data) {
      socket.emit('games', {});
    });

    socket.on('games', function(data) {
      if (data.games) {
        models.numberOfGames(data.games.length);
      }
    });
});