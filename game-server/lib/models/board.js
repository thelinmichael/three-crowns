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
  /* This is the first tile of the game */
  if (this.getNumberOfTiles() == 0) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = tile;
  /* A tile has already been placed at this coordinate */
  } else if (this.hasTile(x, y)) {
    throw new Error("Tile could not be placed: A tile is already there.");
  } else {
    /* Empty spot but has no adjacent tiles */
    if (!this.hasAdjacentTile(x, y)) {
      throw new Error("Tile could not be placed: No tiles are placed adjacent.");
    /* Empty spot with adjacent tiles */
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

module.exports = mongoose.model('Board', schema);
