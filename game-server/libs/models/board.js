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
  if (this.canPlaceTile(x, y, tile, rotation)) {
    if (!this.tiles[x]) {
      this.tiles[x] = [];
    }
    this.tiles[x][y] = tile;
  } else {
    throw new Error("Cannot place tile there");
  }
};

schema.methods.canPlaceTile = function(x, y, tile, rotation) {
  if (this.getNumberOfTiles() === 0) { // OK -- This is the first tile of the game
    return true;
  }

  if ( this.hasTile(x, y) ||  // NOT OK -- Coordinate taken
      !this.hasAdjacentTile(x, y) ||  // NOT OK -- No adjacent tiles
      !this.adjacentTilesHasMatchingEdges(x, y, tile, rotation)) {   // NOT OK -- Adjacent tiles' edges doesn't match
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

schema.methods.rotateEdges = function(edges, rotation) {
  for (var i = 0; i < rotation % 4; i++) {
    var north = edges.north;
    var east = edges.east;
    var south = edges.south;
    var west = edges.west;
    edges.north = west;
    edges.east = north;
    edges.south = east;
    edges.west = south;
  }
  return edges;
};

schema.methods.adjacentTilesHasMatchingEdges = function(x, y, tile, rotation) {
  var edges = {
    north : tile.getEdges().north,
    east : tile.getEdges().east,
    south : tile.getEdges().south,
    west : tile.getEdges().west
  };

  if (rotation) {
    edges = this.rotateEdges(edges, rotation);
  }

  /* Checking east edge of placed tile */
  if (this.hasTile(x + 1, y)) {
    var eastMatches = this.getTile(x + 1, y).getEdges().west == edges.east;
    if (!eastMatches) {
      return false;
    }
  }

  /* Checking west edge of placed tile */
  if (this.hasTile(x - 1, y)) {
    var westMatches = this.getTile(x - 1, y).getEdges().east == edges.west;
    if (!westMatches) {
      return false;
    }
  }

  /* Checking north edge of placed tile */
  if (this.hasTile(x, y + 1)) {
    var northMatches = this.getTile(x, y + 1).getEdges().south == edges.north;
    if (!northMatches) {
      return false;
    }
  }

  /* Checking south edge of placed tile */
  if (this.hasTile(x, y - 1)) {
    var southMatches = this.getTile(x, y - 1).getEdges().north == edges.south;
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