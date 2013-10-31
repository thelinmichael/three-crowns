var mongoose = require("mongoose");
var Tile = require("./tile");
var schema = mongoose.Schema({
  tiles : []
});

schema.methods.hasAdjacentTile = function(x, y) {
  return (this.hasTile(x - 1, y) ||
          this.hasTile(x + 1, y) ||
          this.hasTile(x, y - 1) ||
          this.hasTile(x, y + 1));
}

schema.methods.getTiles = function() {
  return this.tiles;
}

schema.methods.placeTile = function(x, y, tile) {
  /* OK -- This is the first tile of the game */
  if (this.getNumberOfTiles() == 0) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = tile;
  } else if (this.hasTile(x, y)) {
    throw new Error("Tile could not be placed: A tile is already there.");
  } else {
    if (!this.hasAdjacentTile(x, y)) {
      throw new Error("Tile could not be placed: No tiles are placed adjacent.");
    } else if (!this.adjacentTilesHasMatchingEdges(x, y, tile)) {
      throw new Error("Tile could not be placed: Adjacent tiles' edges don't match.");
    /* OK -- Empty spot with adjacent tiles with matching edges */
    } else {
      if (!this.tiles[x]) {
        this.tiles[x] = [];
      }
      this.tiles[x][y] = tile;
    }
  }
}

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
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
    var matches = this.getTile(x - 1, y).getEdges()["east"] == tile.getEdges()["east"];
    if (!matches) {
      return false;
    }
  }
  return true;
}

module.exports = mongoose.model('Board', schema);
