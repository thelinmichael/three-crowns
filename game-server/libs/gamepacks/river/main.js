var config = require("./config.json");

var BaseGame = {

  /**
   *  @returns {Array} Returns an array of {Tile} that are included in the river.
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
   * @returns {Array} No meeples are included in the river expansion.
   */
  getMeeples : function() {
    return [];
  }

};

module.exports = BaseGame;