var mongoose = require("mongoose");
var Tile = require("./tile");
var schema = mongoose.Schema({
  tiles : []
});

schema.methods.hasAdjacentTile = function(x, y) {
  return (this.tiles[x - 1, y] ||
          this.tiles[x + 1, y] ||
          this.tiles[x, y - 1] ||
          this.tiles[x, y + 1]);
}

schema.methods.getTiles = function() {
  return this.tiles;
}

schema.methods.placeTile = function(x, y, tile) {
  /* This is the first tile of the game */
  if (this.getNumberOfTiles() == 0) {
    this.tiles[x, y] = tile;
  /* A tile has already been placed at this coordinate */
  } else if (this.tiles[x, y]) {
    throw new Error("Tile could not be placed: A tile is already there.");
  } else {
    /* Empty spot but has no adjacent tiles */
    if (!this.hasAdjacentTile(x, y)) {
      throw new Error("Tile could not be placed: No tiles are placed adjacent.");
    /* Empty spot with adjacent tiles */
    } else {
      this.tiles[x, y] = tile;
    }
  }
}

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
}

schema.methods.getTile = function(x,y) {
  return this.tiles[x, y];
}

module.exports = mongoose.model('Board', schema);
