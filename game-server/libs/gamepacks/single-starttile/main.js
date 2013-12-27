var config = require("./config.json");

var BaseGame = {

  /**
   *  @returns {Array} Returns an array of {Tile} that are included in this gamepack.
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
   * @returns {Array} An empty array as this gamepack doesn't include any meeples.
   */
  getMeeples : function() {
    return [];
  }

};

module.exports = BaseGame;