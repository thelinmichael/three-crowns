var mongoose = require("mongoose");
var Tile = require("./tile");

var schema = mongoose.Schema({
  tiles : ['Tile']
});

schema.methods.hasAdjacentTile = function(x, y) {
  return (this.hasTile(x - 1, y) ||
          this.hasTile(x + 1, y) ||
          this.hasTile(x, y - 1) ||
          this.hasTile(x, y + 1));
}

schema.methods.placeTile = function(x, y, tile) {
  if (this.canPlaceTile(x, y, tile)) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = tile;
  } else {
    throw new Error("Cannot place tile there");
  }
}

schema.methods.canPlaceTile = function(x, y, tile) {
  if (this.getNumberOfTiles() == 0) {                     // OK -- This is the first tile of the game
    return true;
  }

  if ( this.hasTile(x, y) ||                               // NOT OK -- Coordinate taken
      !this.hasAdjacentTile(x, y) ||                       // NOT OK -- No adjacent tiles
      !this.adjacentTilesHasMatchingEdges(x, y, tile)) {   // NOT OK -- Adjacent tiles' edges doesn't match
    return false;
  } else {
    return true;
  }
}

schema.methods.getTile = function(x, y) {
  if (this.hasTile(x, y)) {
    return this.tiles[x][y];
  }
}

schema.methods.hasTile = function(x, y) {
  return (this.tiles[x] && this.tiles[x][y]);
}

schema.methods.adjacentTilesHasMatchingEdges = function(x, y, tile) {
  /* Checking east edge of placed tile */
  if (this.hasTile(x + 1, y)) {
    var matches = this.getTile(x + 1, y).getEdges()["west"] == tile.getEdges()["east"];
    if (!matches) {
      return false;
    }
  }

  /* Checking west edge of placed tile */
  if (this.hasTile(x - 1, y)) {
    var matches = this.getTile(x - 1, y).getEdges()["east"] == tile.getEdges()["west"];
    if (!matches) {
      return false;
    }
  }

  /* Checking north edge of placed tile */
  if (this.hasTile(x, y + 1)) {
    var matches = this.getTile(x, y + 1).getEdges()["south"] == tile.getEdges()["north"];
    if (!matches) {
      return false;
    }
  }

  /* Checking south edge of placed tile */
  if (this.hasTile(x, y - 1)) {
    var matches = this.getTile(x, y - 1).getEdges()["north"] == tile.getEdges()["south"];
    if (!matches) {
      return false;
    }
  }

  return true;
}

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
}

schema.methods.getTiles = function() {
  return this.tiles;
}

module.exports = mongoose.model('Board', schema);
