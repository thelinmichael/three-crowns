var mongoose = require("mongoose");
var Board = require("../models/board");
var Player = require("../models/player");

/**
 * This model describes a Game. A game has general information such as start and end time, as well as
 * what players are in the game, and the game's board. It also keeps track of what tiles are left,
 * who'se player's turn it is, and which tile is up next.
 *
 * startTime {Date} The time the game started
 * endTime   {Date} The time the game ended
 * players   {Array} An array of {Player} who are playing the game
 * tiles {Array} An array of {Tile}
 * players {Array} An array of players and what kit they've got
 *   player {Player} A player
 *   meeples {Array} The meeples the player has left
 *   buildings {Array} The buildings the player has left
 * startingKit {Object} Meeples and buildings that each player start out with
 *   meeples   {Array} An array of {Meeples}, e.g. Regular Meeple, Big Meeple, Mayor, Pig
 *   buildings {Array} An array of {Buildings}, e.g. Farm, Tower floors
 * currentRound {Object} Things that change each round, such as active player and tile
 *   player {Number} The index of the active player in the {players} array
 *   tile   {Number} The index of the active tile in the {tiles} array
 * board {Board} The game's board
 */
var schema = mongoose.Schema({
  startTime: Date,
  endTime : Date,
  players : [],
  tiles : ['Tile'],
  startingKit : {
    meeples : [],
    buildings : []
  },
  currentRound : {
    player : { type: Number, default: 0 },
    tile : { type: Number, default : 0 }
  },
  board : {}
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
    self.tiles = self.tiles.concat(tiles);

    /* Add meeples (e.g. regular, and big meeple) from the gamepack to the kit that each player gets */
    var startingMeeples = gamepack.getStartingMeeples();
    self.startingKit.meeples = self.startingKit.meeples.concat(startingMeeples);

    /* Add buildings (e.g. tower floors, barns) from the gamepack to the kit that each player gets */
    var startingBuildings = gamepack.getStartingBuildings();
    self.startingKit.buildings = self.startingKit.buildings.concat(startingBuildings);
  });
};

/**
 * Go to next turn.
 */
schema.methods.nextTurn = function() {
  throw new Error("Not implemented!");
  /* If there are no more tiles at the end of the turn,
     the game ends. */

  /* Change active player to the next player */

  /* Change active tile to the tile that's currently at the top of the stack */
};

/**
 *  Places a tile on the specified coordinate on the board.
 *  Side effect: Removes the first tile from the tile queue.
 */
schema.methods.placeTile = function(x, y, rotation) {
  this.board.placeTile(x, y, this.tiles[this.currentRound.tile], rotation);
};

/**
 * Starts the game
 * @throws Throws an error if the game has already started.
 */
schema.methods.start = function() {
  if (!this.isStarted()) {
    this.startTime = Date.now();
    this.board = new Board();
    this.shuffleTiles();
    this.distributeMeeplesAndBuildingsToPlayers();
  } else {
    throw new Error("Game has already been started");
  }
};

/**
 * Shuffle the tiles in the tile queue.
 */
schema.methods.shuffleTiles = function() {
  this.tiles = _shuffle(this.tiles);
};

/**
 * Distribute meeples and buildings to the players.
 * RISK: This may copy the reference to the starting kit instead of cloning it.
 */
schema.methods.distributeMeeplesAndBuildingsToPlayers = function() {
  var self = this;
  this.players.forEach(function(player) {
    player.meeples = self.startingKit.meeples;
    player.buildings = self.startingKit.buildings;
  });
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
schema.methods.addPlayer = function(newPlayer) {
  if (this.isStarted()) {
    throw new Error("Players cannot be added once game has started");
  }

  if (this.players.length > 0) {
    var foundPlayer = this.players.every(function(player) {
      return (player.player === newPlayer)
    });
    if (foundPlayer) {
      throw new Error("Player already exists in the game.");
    }
  }

  /* Object that holds the player and the kit that the player has */
  var newPlayerContainer = {
    "player" : newPlayer,
    "meeples"  : [],
    "buildings" : []
  };
  this.players.push(newPlayerContainer);
};

schema.methods.getTiles = function() {
  if (this.isStarted()) {
    return this.tiles;
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
    return this.players[this.currentRound.player].player;
  }
};

schema.methods.getActiveTile = function() {
  return this.tiles[this.currentRound.tile];
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

/* Shuffles an array, courtesy of Google */
var _shuffle = function(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

module.exports = schema;