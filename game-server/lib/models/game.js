var mongoose = require("mongoose");
var Board = require("./board");

var schema = mongoose.Schema({
  startTime: Date,
  endTime : Date,
  players : ['Player'],
  unplacedTiles : ['Tile'],
  board : {} // TODO: Find a way to reference a single model.
});

schema.methods.start = function() {
  if (!this.isStarted()) {
	 this.startTime = Date.now();
   this.board = new Board();
  }
};

schema.methods.end = function() {
  if (!this.isEnded() && this.isStarted()) {
    this.endTime = Date.now();
  }
};

schema.methods.isEnded = function() {
	return (this.endTime != undefined);
};

schema.methods.isStarted = function() {
	return (this.startTime != undefined);
};

schema.methods.inProgress = function() {
	return (this.isStarted() && !this.isEnded());
};

schema.methods.getStartingTime = function() {
  return this.startTime;
}

schema.methods.getEndTime = function() {
  return this.endTime;
}

schema.methods.getPlayers = function() {
  return this.players;
};

schema.methods.addPlayer = function(player) {
  if (this.isStarted()) {
    throw new Error("Players cannot be added once game has started");
  } else if (this.players.indexOf(player) == -1) {
    this.players.push(player);
  } else {
    throw new Error("Player already exists in the game");
  }
};

schema.methods.getUnplacedTiles = function() {
  if (this.isStarted()) {
    return this.unplacedTiles;
  } else {
    throw new Error("Cannot get unplaced tiles as game hasn't started");
  }
}

schema.methods.getBoard = function() {
  if (this.isStarted()) {
    return this.board;
  } else {
    throw new Error("Cannot get board as game hasn't started");
  }
}

module.exports = mongoose.model('Game', schema);