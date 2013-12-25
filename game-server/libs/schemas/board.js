var mongoose = require("mongoose");

/**
 * This model describes the board.
 * The board knows about the tiles placed on it, and in which
 * rotation the tile was placed. It also holds helper functionality
 * necessary to place tiles, meeples, etc on the board, as well as retrieve
 * information about what's been placed.
 * tiles {Object} Object where keys are {String} x,y,
 * holding an object {Tile} tile, {Number} rotation.
 */
var schema = mongoose.Schema({
  tiles : { "type" : {}, "default" : [] }
});

/**
 * @params {Number} x The coordinate on the x axis
 * @params {Number} y The coordinate on the y axis
 * @returns {Boolean} Returns true if there are tiles adjacent to the position {x},{y}.
 */
schema.methods.hasAdjacentTile = function(x, y) {
  return (this.hasTile(x - 1, y) ||
          this.hasTile(x + 1, y) ||
          this.hasTile(x, y - 1) ||
          this.hasTile(x, y + 1));
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 * @throws Will throw if {tile} cannot be placed on {x},{y} with rotation {rotation}
 * TODO: Should be checks if the tile can indeed be placed.
 */
schema.methods.placeTile = function(x, y, tile, rotation) {
  var index = x + "," + y;
  this.tiles[index] = {
    "tile" : tile,
    "rotation" : rotation
  };
};

schema.methods.getNumberOfTiles = function() {
  return Object.keys(this.tiles).length;
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 */
schema.methods.canPlaceTile = function(x, y, tile, rotation) {

  /* Checking for first tile of the game */
  if (this.getNumberOfTiles() === 0) {
    return true;
  }

  /* Checking if the tile is already taken */
  if (this.hasTile(x, y)) {
    return false;
  }

  /* Checking if this tile has any adjacent tiles */
  if (!this.hasAdjacentTile(x, y)) {
    return false;
  }

  /* Checking for tile specific requirements */
  if (!tile.withRotation(rotation).canBePlacedAt(x, y, board)) {
    return false;
  }

  return true;
};

/**
 *  @returns {Array} Returns an array containing {Number} x, {Number} y for coordinates
 *  where no tile is placed, but adjacent to some other tile
 */
schema.methods.getPossiblePositions = function() {
  var possiblePositions = [],
      key;

  for (key in this.tiles) {
    var coordinates = key.split(",");
    var x = coordinates[0];
    var y = coordinates[1];

    if (!this.hasTile(parseInt(x+1), y)) {
      possiblePositions.push(parseInt(x+1) + "," + y);
    }
    if (!this.hasTile(parseInt(x-1), y)) {
      possiblePositions.push(parseInt(x-1) + "," + y);
    }
    if (!this.hasTile(x, parseInt(y-1))) {
      possiblePositions.push(x + "," + parseInt(y-1));
    }
    if (!this.hasTile(x, parseInt(y+1))) {
      possiblePositions.push(x + "," + parseInt(y+1));
    }
  }

  return possiblePositions;
};

/**
 * @params {Tile} tile The tile to be placed on the board
 * @returns {Array} Returns an array of objects consisting of {Number} x and {Number} y coordinates
 * where the {tile} can be placed
 */
schema.methods.getPossiblePlacementsForTile = function(tile) {
  throw new Error("Not implemented!");
};

/**
 * @params {Number} x
 * @params {Number} y
 * @returns {Tile|undefined} The tile at position {x},{y}, otherwise undefined
 */
schema.methods.getTile = function(x, y) {
  return this.tiles[x + "," + y];
};

schema.methods.hasTile = function(x, y) {
  var tileAtPosition = this.getTile(x,y);
  return (tileAtPosition !== undefined);
};

module.exports = schema;