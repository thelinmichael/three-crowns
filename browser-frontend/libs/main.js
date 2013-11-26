var ko = require('../vendor/knockout-3.0.0.js');
var viewModels = require('./viewmodels/viewmodels');
var GameServerApi = require('threecrowns-sdk');

ko.applyBindings(viewModels.Status);

// Move all these actions to some other module.
var api = new GameServerApi('http://localhost:8090');
api.connect(function() {
  console.log("Connected to the game server.");
  updateStatus();
});

api.on('connection', function (data) {
  api.ping(function(pong) {
    console.log("Retrieved '" + pong.message + "' from server!");
  });
});

api.on('server-status', function(status) {
  console.log("Retrieved server status");
  viewModels.Status.numberOfGames(status.numberOfGames);
  viewModels.Status.games(status.games);
});

api.on('create', function(status) {
  if (status.error) {
    console.log("Game creation aborted.");
  } else if (status.success) {
    console.log("Game was created successfully!");
    api.numberOfGames(function(number) {
      viewModels.Status.numberOfGames(number);
    });
  } else {
    throw new Error("Something weird happened.");
  }
});

document.getElementById('createGame').onclick = function() {
  api.createGame({}, function() {});
};

document.getElementById('watch').onclick = function() {
  var gameToWatch = document.getElementById('gameId').value;
  console.log("You want to watch " + gameToWatch);
};

var updateStatus = function() {
  console.log("Getting server status...");
  api.getServerStatus();
};