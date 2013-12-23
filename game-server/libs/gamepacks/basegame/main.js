var Tiles = require("./tiles/tiles");
var Meeples = require("./meeples/meeples");

var BaseGame = {

  /**
   *  @returns {Array} Returns an array of {Tile} that are included in the basegame.
   */
  getTiles : function() {
    return Tiles.getTiles();
  },

  /**
   * @returns {Array} Returns an array of {Meeple} that are included in the basegame.
   */
  getStartingMeeples : function() {
    var startingMeeples = Meeples.getMeeples();
    return startingMeeples;
  },

  /**
   *  No buildings are included in the basegame.
   *  @returns {Array} Returns an array of {Building} that are included in the base game.
   **/
  getStartingBuildings : function() {
    return [];
  }

};

module.exports = BaseGame;