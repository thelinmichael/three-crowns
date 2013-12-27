var config = require("./config.json");

var BaseGame = {

  /**
   *  @returns {Array} Returns an array of {Tile} that are included in the basegame.
   */
  getTiles : function() {
    var startingTiles = [];
    for (var tileId in config.tiles) {
      if (config.tiles.hasOwnProperty(tileId)) {
        var tile = require("./tiles/" + tileId);
        startingTiles.push(tile);
      }
    }
    return startingTiles;
  },

  /**
   * @returns {Array} Returns an array of {Meeple} that each player starts with when playing
   * with the basegame.
   */
  getMeeples : function() {
    var startingMeeples = [];
    for (var meepleId in config.meeples) {
      if (config.meeples.hasOwnProperty(meepleId)) {
        var meeple = require("./meeples/" + meepleId);
        startingMeeples.push(meeple);
      }
    }
    return startingMeeples;
  }

};

module.exports = BaseGame;