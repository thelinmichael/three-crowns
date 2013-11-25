var ko = require('../vendor/knockout-3.0.0.js');
var viewModels = require('./viewmodels/viewmodels');
var GameServerApi = require('threecrowns-sdk');

ko.applyBindings(viewModels.Status);

// Move all these actions to some other module.
var socket = io.connect('http://localhost:8090');
var api = new GameServerApi(socket);

socket.on('connection', function (data) {
  api.ping(function(pong) {
    console.log("Retrieved '" + pong.message + "' from server!");
  });
});

socket.on('server-status', function(status) {
  viewModels.Status.numberOfGames(status.numberOfGames);
  viewModels.Status.games(status.games);
});