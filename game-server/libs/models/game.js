var mongoose = require("mongoose");
var Board = require("./board");
var Player = require("./player");
var DrawpileShufflingStrategy = require("../drawpile-shuffling-strategy");
var PlaceTile = require("./placetile-action");

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
 *   points {Number}
 * startingKit {Object} Meeples each player start out with
 *   meeples   {Array} An array of {Meeples}, e.g. Regular Meeple, Big Meeple, Mayor, Pig
 * currentRound {Object} Things that change each round, such as active player and tile
 *   player {Number} The index of the active player in the {players} array
 *   tile   {Number} The index of the active tile in the {tiles} array
 *   actions {Array}
 *     mandatory {Array} An array of {Action}s that must be performed before the end of the turn
 *     optional {Array} An array of {Actions}s that are optional
 * board {Board} The game's board
 */
var schema = mongoose.Schema({
  startTime: Date,
  endTime : Date,
  players : [{
    player : {},
    meeples : [],
    points : { type : Number, default : 0 }
  }],
  tiles : ['Tile'],
  startingKit : {
    meeples : [{
      model : {},
      amount : { type : Number }
    }]
  },
  currentRound : {
    player : { type: Number, default: 0 },
    tile : { type: Number, default : 0 },
    actions : {
      mandatory : { type: Array, default: [] },
      optional : { type: Array, default: [] }
    }
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
    self.startingKit.meeples = self.startingKit.meeples.concat(gamepack.getMeeples());
  });
};

/**
 * Go to next turn or end the game if it was the last turn.
 * @returns {Boolean} Returns true if successfully changed to the next turn or ended the game, false otherwise.
 * @throws If there are still unperformed mandatory actions left.
 */
schema.methods.nextTurn = function() {
  if (this.hasUnperformedMandatoryActions()) {
    throw new Error("Tried to go to next turn, but still has mandatory actions");
  }

  if (this.isLastTile()) {
    this.end();
  } else {
    this.resetActions();
    this.skipToNextPlayer();
    this.skipToNextTile();
  }
  return true;
};

schema.methods.resetActions = function() {
  this.removeAllActions();
  this.distributeActions();
};

schema.methods.skipToNextPlayer = function() {
  this.currentRound.player = (this.currentRound.player + 1) % (this.players.length);
};

schema.methods.skipToNextTile = function() {
  this.currentRound.tile++;
  var possiblePlacementsForTile = this.board.getPossiblePlacementsForTile(this.getActiveTile());
  while (possiblePlacementsForTile.length === 0) {
    if (this.isLastTile()) {
      this.end();
    } else {
      this.currentRound.tile++;
      possiblePlacementsForTile = this.board.getPossiblePlacementsForTile(this.getActiveTile());
    }
  }
};

schema.methods.isLastTile = function() {
  return (this.currentRound.tile == this.tiles.length - 1);
};

schema.methods.getActions = function() {
  return this.currentRound.actions.mandatory.concat(this.currentRound.actions.optional);
};

schema.methods.getMandatoryActions = function() {
  return this.currentRound.actions.mandatory;
};

schema.methods.getOptionalActions = function() {
  return this.currentRound.actions.optional;
};

schema.methods.performAction = function(action, options) {
  action.perform(this, options);

  if (this.getUnperformedActions().length === 0) {
    this.nextTurn();
  }
};

schema.methods.getActionsByName = function(name) {
  var actions = this.currentRound.actions.mandatory.concat(this.currentRound.actions.optional);
  var filteredActions = actions.filter(function(action) {
    return action.name == name;
  });
  return filteredActions;
};

/**
 *  Places a tile on the specified coordinate on the board.
 *  Side effect: Removes the first tile from the tile queue.
 */
schema.methods.placeTile = function(x, y, rotation) {
  var self = this;

  var placeTileAction = this.getActionsByName("PlaceTile");
  if (placeTileAction.length === 0) {
    throw new Error("Attempted to place a tile, but the current player doesn't have any place tile actions");
  }
  var options = {
    "x" : x,
    "y" : y,
    "tile" : this.tiles[this.currentRound.tile],
    "rotation" : rotation
  };
  this.performAction(placeTileAction[0], options);
};

schema.methods.placeMeeple = function(x, y, tilearea, meeple) {
  var self = this;

  var placeMeepleAction = this.getActionsByName("PlaceMeeple");
  if (placeMeepleAction.length === 0) {
    throw new Error("Attempted to place a meeple, but the current player doesn't have any place meeple actions!");
  }

  var options = {
    "x" : x,
    "y" : y,
    "tilearea" : tilearea,
    "meeple" : meeple
  };
  this.performAction(placeMeepleAction[0], options);
};

schema.methods.returnMeeplesFromFinishedAreas = function() {
  var self = this;
  var finishedPlacements = this.board.getFinishedMeeplePlacements();

  finishedPlacements.forEach(function(finishedPlacement) {
    if (finishedPlacement.tileArea.areaType.returnMeepleOnFinish) {

      /* Remove it from the board */
      self.board.removeMeeple(finishedPlacement.x, finishedPlacement.y, finishedPlacement.tileArea, finishedPlacement.meeple);

      /* Return it to the player */
      self.returnMeeple(finishedPlacement.meeple);
    }
  });
};

schema.methods.scoreFinishedAreas = function() {
  var self = this;

  var finishedPlacements = this.board.getFinishedMeeplePlacements();
  finishedPlacements.forEach(function(finishedPlacement) {
    if (finishedPlacement.tileArea.areaType.connectable) {
      var areasInvolvedInStructure = self.board.getTileAreasCoveredByConnectableArea(finishedPlacement.x, finishedPlacement.y, finishedPlacement.tileArea);
      var score = finishedPlacement.tileArea.areaType.getScore(this.board, areasInvolvedInStructure);
      self.giveScore(finishedPlacement.meeple.owner, score);
    }
  });
};

schema.methods.giveScore = function(playerToScore, amount) {
  var playerContainer = this.players.filter(function(player) {
    return playerToScore.equals(player.player);
  });

  playerContainer[0].points = playerContainer[0].points + amount;
};

schema.methods.removeMeepleFromActivePlayer = function(meepleToRemove) {
  var activePlayer = this.getActivePlayer();
  this.players.forEach(function(player) {
    if (activePlayer.equals(player.player)) {
      player.meeples.pull(meepleToRemove);
    }
  });
};

schema.methods.returnMeeple = function(meeple) {
  this.players.forEach(function(player) {
    if (meeple.owner.equals(player.player)) {
      player.meeples.push(meeple);
    }
  });
};

/**
 * Starts the game
 * @throws Throws an error if the game has already started.
 */
schema.methods.start = function(options) {
  if (!this.isStarted()) {
    this.startTime = Date.now();
    this.board = new Board();

    /* TODO: Refactor this option handling. */
    var shuffleOptions = options ? options.shuffle : {};
    this.shuffleTiles(shuffleOptions);

    this.distributeStartingKitToPlayers();
    this.distributeActions();
  } else {
    throw new Error("Game has already been started");
  }
};

schema.methods.distributeActions = function() {
  this.giveMandatoryAction(new PlaceTile());
};

schema.methods.giveMandatoryAction = function(action) {
  this.currentRound.actions.mandatory.push(action);
};

schema.methods.giveOptionalAction = function(action) {
  this.currentRound.actions.optional.push(action);
};

schema.methods.removeAction = function(actionToRemove) {
  var successFullyRemoved = false,
      self = this;

  this.currentRound.actions.mandatory.forEach(function(action, index) {
    if (action == actionToRemove) {
      self.currentRound.actions.mandatory.splice(index, 1);
    }
  });
  this.currentRound.actions.optional.forEach(function(action, index) {
    if (action == actionToRemove) {
      self.currentRound.actions.optional.splice(index, 1);
    }
  });
};

schema.methods.removeAllActions = function() {
  this.currentRound.actions.optional = [];
  this.currentRound.actions.mandatory = [];
};

/**
 *  @returns {Array} of objects containing {Number} x, {Number} y and {Array} areas of {TileArea}.
 */
schema.methods.getPossibleMeeplePlacements = function() {
  var self = this;

  if (!this.tileHasBeenPlacedThisRound()) {
    return [];
  }

  var tilePlacedThisRound = this.board.getLastPlayedTile();
  var meepleFreeAreas = this.board.getAreasFreeFromMeeplesOnTile(tilePlacedThisRound);
  if (meepleFreeAreas) {
    return [meepleFreeAreas];
  } else {
    return [];
  }
};

schema.methods.tileHasBeenPlacedThisRound = function() {
  return this.getPerformedActions().some(function(action) {
    return action.name == 'PlaceTile';
  });
};

schema.methods.getPerformedActions = function() {
  return this.getPerformedMandatoryActions().concat(this.getPerformedOptionalActions());
};

schema.methods.getUnperformedActions = function() {
  return this.getUnperformedMandatoryActions().concat(this.getUnperformedOptionalActions());
};

schema.methods.getPerformedMandatoryActions = function() {
  return this.currentRound.actions.mandatory.filter(function(action) {
    return action.isPerformed();
  });
};

schema.methods.getPerformedOptionalActions = function() {
  return this.currentRound.actions.optional.filter(function(action) {
    return action.isPerformed();
  });
};

schema.methods.getUnperformedMandatoryActions = function() {
  return this.getMandatoryActions().filter(function(action) {
    return !action.isPerformed();
  });
};

schema.methods.getUnperformedOptionalActions = function() {
  return this.getOptionalActions().filter(function(action) {
    return !action.isPerformed();
  });
};

/**
 * Shuffle the tiles in the tile queue.
 */
schema.methods.shuffleTiles = function(options) {
  this.tiles = DrawpileShufflingStrategy.shuffle(this.tiles, options);
};

/**
 * Distribute meeples to the players.
 */
schema.methods.distributeStartingKitToPlayers = function() {
  var self = this;
  this.players.forEach(function(player) {
    self.startingKit.meeples.forEach(function(meeple) {
      for (var i = 0; i < meeple.amount; i++) {
        var newMeeple = new meeple.model({ "owner" : player.player });
        player.meeples.push(newMeeple);
      }
    });
  });
};

schema.methods.getPointsForPlayer = function(playerToGetPointsFor) {
  var playerContainer = this.players.filter(function(player) {
    return player.player.equals(playerToGetPointsFor);
  });

  if (playerContainer.length === 0) {
    throw new Error("Didn't find player!");
  } else if (playerContainer.length > 1) {
    throw new Error("Found more than one player!");
  }

  return playerContainer[0].points;
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

schema.methods.addPlayerByName = function(name) {
  var player = new Player(name);
  this.addPlayer(player);
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
      return (player.player === newPlayer);
    });
    if (foundPlayer) {
      throw new Error("Player already exists in the game.");
    }
  }

  /* Object that holds the player and the kit that the player has */
  var newPlayerContainer = {
    "player" : newPlayer,
    "meeples"  : []
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

schema.methods.getActivePlayersMeeples = function() {
  if (!this.inProgress()) {
    throw new Error("No active player as game isn't in progress");
  } else {
    return this.players[this.currentRound.player].meeples;
  }
};

schema.methods.getActiveTile = function() {
  return this.tiles[this.currentRound.tile];
};

schema.methods.getCurrentRoundNumber = function() {
  if (this.isStarted()) {
    return this.currentRound.tile + 1;
  } else {
    return 0;
  }
};

schema.methods.hasUnperformedMandatoryActions = function() {
  return this.getMandatoryActions().some(function(action) {
    return !action.isPerformed();
  });
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

module.exports = mongoose.model('Game', schema);
module.exports.schema = schema;