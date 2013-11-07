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
  board : {}     // Type: Board
});

schema.methods.nextTurn = function() {
  /* If there are no more tiles at the end of the turn,
     the game ends. */
  if (this.getQueuedTiles().length == 0) {
    this.end();
  }

  /* Change active player to the next player */
  this.currentRound.player = this.getPlayers()[(this.getPlayers().indexOf(this.currentRound.player) + 1) % this.getPlayers().length];

  /* Change active tile to the tile that's currently at the top of the stack */
  this.currentRound.tile = this.getQueuedTiles()[0];
}

/* Places a tile on the specified coordinate
   on the board.
   Side effect: Removes the first tile from the tile queue */
schema.methods.placeTile = function (x, y) {
  this.board.placeTile(x, y, this.tileQueue[0]);
  this.tileQueue = this.tileQueue.splice(1);
}

schema.methods.start = function() {
  if (!this.isStarted()) {
	 this.startTime = Date.now();
   this.board = new Board();
   this.currentRound.player = this.players[0];
   this.currentRound.tile = this.tileQueue[0];
  } else {
    throw new Error("Game has already been started");
  }
};

schema.methods.end = function() {
  if (!this.isEnded() && this.isStarted()) {
    this.endTime = Date.now();
  } else {
    throw new Error("Cannot end a game that isn't in progress");
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
  if (this.isStarted()) {
    return this.startTime;
  } else {
    throw new Error("Game has not been started");
  }
}

schema.methods.getEndTime = function() {
  if (this.isEnded()) {
    return this.endTime;
  } else {
    throw new Error("Game has not ended");
  }
}

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

schema.methods.getActiveTile = function() {
  return this.currentRound.tile;
}

schema.methods.getPlayers = function() {
  return this.players;
};

module.exports = mongoose.model('Game', schema);