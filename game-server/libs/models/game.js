var mongoose = require("mongoose");

var schema = mongoose.Schema({
  startTime : Date,
  endTime   : Date,
  players   : ['Player'],
  tileStack : {},
  board     : {}
});

schema.methods.nextTurn = function() {
  if (player.hasUnperformedMandatoryActions()) {
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
  // Check index of active player. Switch to next player.
};

schema.methods.skipToNextTile = function() {
  // Pop the tile stack
};

schema.methods.isLastTile = function() {
  // Check if stack is empty
};

schema.methods.getActions = function() {
  // Get active player's actions
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

/**
 * @param {Player} The player to add to the game
 */
schema.methods.addPlayer = function(player) {
  if (this.isStarted()) {
    throw new Error("Players cannot be added once game has started");
  }
  this.players.push(player);
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