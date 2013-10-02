var mongoose = require("mongoose");
var schema = mongoose.Schema({
  start: Date,
  end : Date,
  players : ['Player'],
});

schema.methods.startGame = function() {
  if (!this.start) {
	 this.start = Date.now();
  }
};

schema.methods.endGame = function() {
  if (!this.end) {
    this.end = Date.now();
  }
};

schema.methods.isEnded = function() {
	return (this.end != undefined);
};

schema.methods.isStarted = function() {
	return (this.start != undefined);
};

schema.methods.inProgress = function() {
	return (this.isStarted() && !this.isEnded());
};

schema.methods.getStartingTime = function() {
  return this.start;
}

schema.methods.getPlayers = function() {
  return this.players;
};

schema.methods.addPlayer = function(player, callback) {
  var error;
  if (this.inProgress()) {
    error = { "error" : "Players cannot be added once game has started" };
  } else if (this.players.indexOf(player) == -1) {
    this.players.push(player);
  } else {
    error = { "error" : "Player already exists in the game"};
  }
  callback(error);
};

module.exports = mongoose.model('Game', schema);