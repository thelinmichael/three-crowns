var mongoose = require("mongoose");
var Board = require("../models/board");

/**
 * This model describes a Game. A game has general information such as start and end time, as well as
 * what players are in the game, and the game's board. It also keeps track of what tiles are left,
 * who'se player's turn it is, and which tile is up next.
 *
 * startTime {Date} The time the game started
 * endTime   {Date} The time the game ended
 * players   {Array} An array of {Player} who are playing the game
 * tileQueue {Array} An array of {Tile}. This queue represent the unplayed tiles in the game
 * startingKit {Object} Meeples and buildings that each player start out with
 *   meeples   {Array} An array of {Meeples}, e.g. Regular Meeple, Big Meeple, Mayor, Pig
 *   buildings {Array} An array of {Buildings}, e.g. Farm, Tower floors
 * currentRound {Object} Things that change each round, such as active player and tile
 *   player {Player} The active player
 *   tile   {Tile}   The tile that is about to be placed
 * board {Board} The game's board
 */
var schema = mongoose.Schema({
  startTime: Date,
  endTime : Date,
  players : ['Player'],
  tileQueue : ['Tile'],
  startingKit : {
    meeples : [],
    buildings : []
  },
  currentRound : {
    player : [],
    tile : []
  },
  board : []
});

/**
 * Add basegame and/or expansions to this game
 * @param {Array} Array of gamepacks that will be added to this game
 */
schema.methods.addPacks = function(gamepacks) {
  var self = this;
  gamepacks.forEach(function(gamepack) {
    /* Add tiles from the gamepack */
    var tiles = gamepack.getTiles();
    self.tileQueue.concat(tiles);

    /* Add meeples (e.g. regular, and big meeple) from the gamepack to the kit that each player gets */
    var startingMeeples = gamepack.getStartingMeeples();
    self.startingKit.meeples.concat(startingMeeples);

    /* Add buildings (e.g. tower floors, barns) from the gamepack to the kit that each player gets */
    var startingBuildings = gamepack.getStartingBuildings();
    self.startingKit.buildings.concat(startingBuildings);
  });
};

/**
 * Shuffle the tiles in the tile queue.
 */
schema.methods.shuffleTileQueue = function() {
  throw new Error("Not implemented!");
}

/**
 * Go to next turn.
 */
schema.methods.nextTurn = function() {
  /* If there are no more tiles at the end of the turn,
     the game ends. */
  if (this.getQueuedTiles().length === 0) {
    this.end();
  }

  /* Change active player to the next player */
  this.currentRound.player = this.getPlayers()[(this.getPlayers().indexOf(this.currentRound.player) + 1) % this.getPlayers().length];

  /* Change active tile to the tile that's currently at the top of the stack */
  this.currentRound.tile = this.getQueuedTiles()[0];
};

/**
 *  Places a tile on the specified coordinate on the board.
 *  Side effect: Removes the first tile from the tile queue.
 */
schema.methods.placeTile = function (x, y, rotation) {
  this.board.placeTile(x, y, this.tileQueue[0], rotation);
  this.tileQueue = this.tileQueue.splice(1);
};

/**
 * Starts the game
 * @throws Throws an error if the game has already started.
 */
schema.methods.start = function() {
  if (!this.isStarted()) {
    this.startTime = Date.now();
    this.board = new Board();
    this.shuffleTileQueue();
    this.currentRound.player = this.players[0];
    this.currentRound.tile = this.tileQueue[0];
  } else {
    throw new Error("Game has already been started");
  }
};

/**
 * Ends the game
 * @throws Throws an error if the game has already ended.
 */
schema.methods.end = function() {
  if (!this.isEnded() && this.isStarted()) {
    this.endTime = Date.now();
  } else {
    throw new Error("Cannot end a game that isn't in progress");
  }
};

/**
 * @param {Player} The player to add to the game
 */
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
};

schema.methods.getBoard = function() {
  if (this.isStarted()) {
    return this.board;
  } else {
    throw new Error("Cannot get board as game hasn't started");
  }
};

schema.methods.getActivePlayer = function() {
  if (!this.inProgress()) {
    throw new Error("No active player as game isn't in progress");
  } else {
    return this.currentRound.player;
  }
};

schema.methods.getActiveTile = function() {
  return this.currentRound.tile;
};

schema.methods.getPlayers = function() {
  return this.players;
};

/**
 * @returns {Boolean} True if the game has ended, otherwise false
 */
schema.methods.isEnded = function() {
  return (this.endTime !== undefined);
};

/**
 * @returns {Boolean} True if the game has started, otherwise false
 */
schema.methods.isStarted = function() {
  return (this.startTime !== undefined);
};

/**
 * @returns {Boolean} True if the game is in progress, otherwise false
 */
schema.methods.inProgress = function() {
  return (this.isStarted() && !this.isEnded());
};

/**
 * @returns {Date} The game's start time
 */
schema.methods.getStartingTime = function() {
  if (this.isStarted()) {
    return this.startTime;
  }
};

/**
 * @returns {Date} The game's end time
 */
schema.methods.getEndTime = function() {
  if (this.isEnded()) {
    return this.endTime;
  }
};

module.exports = schema;