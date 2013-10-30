var mongoose = require("mongoose");
var Board = require("./board");

var schema = mongoose.Schema({
  startTime: Date,
  endTime : Date,
  players : ['Player'],
  tileQueue : ['Tile'],
  currentRound : {
    player : {}, // Type: Player
    tile : {}    // Type: Tile
  },
  board : {} // TODO: Find a way to reference a single model. 
});

schema.methods.start = function() {
  if (!this.isStarted()) {
	 this.startTime = Date.now();
   this.board = new Board();
   this.currentRound.player = this.players[0];
  }
};

schema.methods.end = function() {
  if (!this.isEnded() && this.isStarted()) {
    this.endTime = Date.now();
  } else {
    throw new Error("Cannot end a game that isn't in progress.");
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

schema.methods.getQueuedTiles = function() {
  if (this.isStarted()) {
    return this.tileQueue;
  } else {
    throw new Error("Cannot get tile queue as game hasn't started");
  }
}

schema.methods.getBoard = function() {
  if (this.isStarted()) {
    return this.board;
  } else {
    throw new Error("Cannot get board as game hasn't started");
  }
}

schema.methods.getActivePlayer = function() {
  if (!this.inProgress()) {
    throw new Error("No active player as game isn't in progress");
  } else {
    return this.currentRound.player;
  }
}

schema.methods.nextTurn = function() {
  if (this.getQueuedTiles().length == 0) {
    this.end();
  }
  this.currentRound.player = this.players[(this.players.indexOf(this.currentRound.player) + 1) % this.players.length];
}

/* I don't like this. Board either needs to know which Game it belongs to,
   or Game needs to copy Board's API in order to keep track of which tiles are left. */
schema.methods.placeTile = function (x, y) {
  this.board.placeTile(x, y, this.tileQueue[0]);
  this.tileQueue = this.tileQueue.splice(1);
}

module.exports = mongoose.model('Game', schema);