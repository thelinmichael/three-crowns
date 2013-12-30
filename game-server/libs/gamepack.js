
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
  var tiles = [];
  for (var tileId in this.config.tiles) {
    if (this.config.tiles.hasOwnProperty(tileId)) {
      var tile = require("./gamepacks/" + this.config.gamepackId + "/tiles/" + tileId);
      tiles.push(tile);
    }
  }
  return tiles;
};

/**
 * @returns {Array} Returns an array of {Meeple} that are included in this gamepack.
 */
Gamepack.prototype.getMeeples = function() {
  var meeples = [];
  for (var meepleId in this.config.meeples) {
    if (this.config.meeples.hasOwnProperty(meepleId)) {
      var meeple = require("./gamepacks/" + this.config.gamepackId + "/meeples/" + meepleId);
      meeples.push(meeple);
    }
  }
  return meeples;
};

module.exports = Gamepack;