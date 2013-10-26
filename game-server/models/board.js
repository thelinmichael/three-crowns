var mongoose = require("mongoose");
var Tile = require("./tile");
var schema = mongoose.Schema({
  tiles : {}
});

var tileHash = function(x,y) {
  return x + "," + y;
}

schema.methods.hasAdjacentTile = function(x,y) {
  return (this.tiles[tileHash(x-1,y)] ||
          this.tiles[tileHash(x+1,y)] ||
          this.tiles[tileHash(x,y-1)] ||
          this.tiles[tileHash(x,y+1)]);
}

schema.methods.getTiles = function() {
  return this.tiles;
}

schema.methods.placeTile = function(x,y,tile) {
  if (this.getNumberOfTiles() == 0) {
    this.tiles[tileHash(x,y)] = tile;
    return true;
  } else if (this.tiles[tileHash(x,y)]) {
    return false;
  } else {
    if (!this.hasAdjacentTile(x,y)) {
      return false;
    } else {
      this.tiles[tileHash(x,y)] = tile;
      return true;
    }
  }
}

schema.methods.getNumberOfTiles = function() {
  var numberOfTiles = 0;
  for (var key in this.tiles) {
    numberOfTiles++;
  }
  return numberOfTiles;
}

schema.methods.getTileAt = function(x,y) {
  return this.tiles[tileHash(x,y)];
}

module.exports = mongoose.model('Board', schema);
