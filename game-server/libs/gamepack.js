
/**
 * This class describes a gamepack, which is either the basegame or any extension.
 */
var Gamepack = function(config) {
  this.config = config;

  this.tiles = this.getTiles();
  this.meeples = this.getMeeples();
};

/**
 * @returns {Array} Returns an array of {Tile} that are included in this gamepack.
 */
Gamepack.prototype.getTiles = function() {
  var self = this;
  var loadedTiles = this.config.tiles.map(function(tileEntry) {
    var tile =  require("./gamepacks/" + self.config.gamepackId + "/tiles/" + tileEntry.name);
    tile.shufflePriority = tileEntry.shufflePriority;
    return tile;
  });
  return loadedTiles;
};

/**
 * @returns {Array} Returns an array of {Meeple} that are included in this gamepack.
 */
Gamepack.prototype.getMeeples = function() {
  var self = this;
  var loadedMeeples = this.config.meeples.map(function(meepleEntry) {
    return require("./gamepacks/" + self.config.gamepackId + "/meeples/" + meepleEntry.name);
  });
  return loadedMeeples;
};

module.exports = Gamepack;