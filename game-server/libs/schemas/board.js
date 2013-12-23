var mongoose = require("mongoose");

/**
 * This model describes the board.
 * The board knows about the tiles placed on it, and in which
 * rotation the tile was placed. It also holds helper functionality
 * necessary to place tiles, meeples, etc on the board, as well as retrieve
 * information about what's been placed.
 * tiles
 *   tile {Tile} The tile that is placed on the board
 *   x {Number} The x coordinate on the board where {tile} is placed
 *   y {Number} The y coordinate on the board where {tile} is placed
 *   rotation {Number} The rotation of the {tile} when it has been placed
 */
var schema = mongoose.Schema({
  tiles : []
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
 */
schema.methods.placeTile = function(x, y, tile, rotation) {
  if (this.canPlaceTile(x, y, tile, rotation)) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = tile;
  }
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 */
schema.methods.canPlaceTile = function(x, y, tile, rotation) {
  /* Checking for first tile of the game */
  if (this.tiles.length === 0) {
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
 * @params {Number} x
 * @params {Number} y
 * @returns {Tile|undefined} The tile at position {x},{y}, otherwise undefined
 */
schema.methods.getTile = function(x, y) {
  if (this.hasTile(x, y)) {
    return this.tiles[x][y];
  }
};

schema.methods.hasTile = function(x, y) {
  return (this.tiles[x] !== undefined && this.tiles[x][y] !== undefined);
};

module.exports = schema;