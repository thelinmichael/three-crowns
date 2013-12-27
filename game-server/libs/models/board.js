var mongoose = require("mongoose");

/**
 * This model describes the board.
 * The board knows about the tiles placed on it, and in which
 * rotation the tile was placed. It also holds helper functionality
 * necessary to place tiles, meeples, etc on the board, as well as retrieve
 * information about what's been placed.
 */
var schema = mongoose.Schema({
  tiles : [{
    "x" : { "type" : Number },
    "y" : { "type" : Number },
    "tile" : ['Tile'], // This is bogus. There must surely be an easy way to define another Schema without creating an array.
    "rotation" : { "type": Number }
  }]
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
  var newTileOnBoard = {
    "x" : x,
    "y" : y,
    "tile" : tile,
    "rotation" : rotation
  };
  this.tiles.push(newTileOnBoard);
};

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 * TODO: Needs to pass rotation.
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
  if (!tile.canBePlacedAt(x, y, this)) {
    return false;
  }

  return true;
};

/**
 *  @returns {Array} Returns an array containing {Number} x, {Number} y for coordinates
 *  where no tile is placed, but adjacent to some other tile
 */
schema.methods.getPossiblePositions = function() {
  var self = this,
      possiblePositions = [];

  this.tiles.forEach(function(tileOnBoard) {
    var x = tileOnBoard.x;
    var y = tileOnBoard.y;

    if (!self.hasTile(x+1, y)) {
      possiblePositions.push({ "x" : x+1, "y" : y });
    }
    if (!self.hasTile(x-1, y)) {
      possiblePositions.push({ "x" : x-1, "y": y });
    }
    if (!self.hasTile(x, y-1)) {
      possiblePositions.push({ "x" : x, "y" : (y-1) });
    }
    if (!self.hasTile(x, y+1)) {
      possiblePositions.push({ "x" : x, "y" : (y+1) });
    }

  });

  return possiblePositions;
};

/**
 * @params {Tile} tile The tile to be placed on the board
 * @returns {Array} Returns an array of objects that consists of x : {Number}, y : {Number}.
 * TODO: Add rotation parameter, needs to pass it on.
 */
schema.methods.getPossiblePlacementsForTile = function(tile) {
  var self = this,
      possiblePositions = [];

  /* There are no tiles on the board. The only available place is origo. */
  if (this.getNumberOfTiles() === 0) {
    possiblePositions.push({ "x" : 0, "y" : 0 });
    return possiblePositions;
  }

  /* Check all tiles that are placed on the board, and if they match with {tile} */
  this.tiles.forEach(function(tileOnBoard) {
    var x = tileOnBoard.x;
    var y = tileOnBoard.y;

    if (self.canPlaceTile(x+1, y, tile)) {
      possiblePositions.push({ "x" : x+1, "y" : y });
    }
    if (self.canPlaceTile(x-1, y, tile)) {
      possiblePositions.push({ "x" : x-1, "y": y });
    }
    if (self.canPlaceTile(x, y-1, tile)) {
      possiblePositions.push({ "x" : x, "y" : (y-1) });
    }
    if (self.canPlaceTile(x, y+1, tile)) {
      possiblePositions.push({ "x" : x, "y" : (y+1) });
    }
  });

  return possiblePositions;
};

/**
 * @params {Number} x
 * @params {Number} y
 * @returns {Tile|undefined} The tile at position {x},{y}, otherwise undefined
 */
schema.methods.getTile = function(x, y) {
  var tileWithPosition = this.tiles.filter(function(tileOnBoard) {
    return (tileOnBoard.x === x && tileOnBoard.y === y);
  });
  if (tileWithPosition.length == 1) {
    return {
      "tile" : tileWithPosition[0].tile[0],
      "rotation" : tileWithPosition[0].rotation
    };
  } else if (tileWithPosition.length > 1) {
    throw new Error("Should never get here!");
  }
};

/**
 * @params {Number} x
 * @params {Number} y
 * @returns {Boolean} True if the board has a tile at position {x},{y}, otherwise false.
 */
schema.methods.hasTile = function(x, y) {
  return (this.getTile(x,y) !== undefined);
};


module.exports = mongoose.model('Board', schema);
module.exports.schema = schema;