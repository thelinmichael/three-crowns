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
    return true;
  /* A tile has already been placed at this coordinate */
  } else if (this.tiles[x, y]) {
    return false;
  } else {
    /* Empty spot but has no adjacent tiles */
    if (!this.hasAdjacentTile(x, y)) {
      return false;
    /* Empty spot with adjacent tiles */
    } else {
      this.tiles[x, y] = tile;
      return true;
    }
  }
}

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
}

schema.methods.getTileAt = function(x,y) {
  return this.tiles[x, y];
}

module.exports = mongoose.model('Board', schema);
