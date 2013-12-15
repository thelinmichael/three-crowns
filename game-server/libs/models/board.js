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
};

schema.methods.placeTile = function(x, y, tile, rotation) {
  if (rotation === undefined) {
    throw new Error("Must supply rotation.");
  }

  if (this.canPlaceTile(x, y, tile, rotation)) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    tile = tile.rotate(rotation);
    this.tiles[x][y] = tile;
  } else {
    throw new Error("Cannot place tile there");
  }
};

schema.methods.canPlaceTile = function(x, y, tile, rotation) {
  if (rotation === undefined) {
    throw new Error("Must supply rotation.");
  }

  if (this.getNumberOfTiles() === 0) { // OK -- This is the first tile of the game
    return true;
  }

  if ( this.hasTile(x, y) ||  // NOT OK -- Coordinate taken
      !this.hasAdjacentTile(x, y)) { // NOT OK -- No adjacent tiles
    return false;
  }

  if (!this.adjacentTilesHaveMatchingBorders(x, y, tile, rotation)) {   // NOT OK -- Adjacent tiles' edges doesn't match
    return false;
  } else {
    return true;
  }
};

schema.methods.getTile = function(x, y) {
  if (this.hasTile(x, y)) {
    return this.tiles[x][y];
  }
};

schema.methods.hasTile = function(x, y) {
  return (this.tiles[x] !== undefined && this.tiles[x][y] !== undefined);
};

schema.methods.adjacentTilesHaveMatchingBorders = function(x, y, tile, rotation) {

  /* Checking east edge of placed tile */
  if (this.hasTile(x + 1, y)) {
    var eastMatches = Tile.matchingBorders(this.getTile(x + 1, y).getWesternBorder(0), tile.getEasternBorder(rotation));
    if (!eastMatches) {
      return false;
    }
  }

  /* Checking west edge of placed tile */
  if (this.hasTile(x - 1, y)) {
    var westMatches = Tile.matchingBorders(this.getTile(x - 1, y).getEasternBorder(0), tile.getWesternBorder(rotation));
    if (!westMatches) {
      return false;
    }
  }

  /* Checking north edge of placed tile */
  if (this.hasTile(x, y + 1)) {
    var northMatches = Tile.matchingBorders(this.getTile(x, y + 1).getSouthernBorder(0), tile.getNorthernBorder(rotation));
    if (!northMatches) {
      return false;
    }
  }

  /* Checking south edge of placed tile */
  if (this.hasTile(x, y - 1)) {
    var southMatches = Tile.matchingBorders(this.getTile(x, y - 1).getNorthernBorder(0), tile.getSouthernBorder(rotation));
    if (!southMatches) {
      return false;
    }
  }

  return true;
};

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
};

schema.methods.getTiles = function() {
  return this.tiles;
};

module.exports = mongoose.model('Board', schema);