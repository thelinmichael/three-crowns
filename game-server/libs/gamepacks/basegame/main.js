var Tiles = require("tiles/tiles");
var Meeples = require("meeples/meeples");

var BaseGame = {

  /**
   * @returns {Array} Returns an array of {Meeple} that are included in the basegame.
   */
  getStartingMeeples : function() {
    return Meeples.getTiles();
  },

  /**
   *  No buildings are included in the basegame.
   *  @returns {Array} Returns an array of {Building} that are included in the base game.
   **/
  getStartingBuildings : function() {
    return [];
  },

  /**
   *  @returns {Array} Returns an array of {Tile} that are included in the basegame.
   */
  getTiles : function() {
    return Tiles.getTiles();
  }

};

exports.module = BaseGame;