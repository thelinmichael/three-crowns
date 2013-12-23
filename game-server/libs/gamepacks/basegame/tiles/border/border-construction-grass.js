var BorderConstruction = require("../../../../models/tile-border-construction.js");

var Grass = function() {

  return new BorderConstruction({

    name : "Grass",

    /**
     * This function is run when a building of this type is completed.
     * @returns {Object} Returns an object containing the points given
     */
    onBuildingComplete : function(tilesInvolved) {
      throw new Error("Not implemented!");
    },

    /**
     * @returns {Boolean} True if building is completed, otherwise false
     */
    isBuildingCompleted : function(position, board) {
      throw new Error("Not implemented!");
    },

    /**
     * Grass will give three points per castle that is
     * connected to it.
     */
    onGameFinish : function(tilesInvolved, board) {
      return {
        points : 3 * board.connectingCastles(tilesInvolved);
      }
    },

    /**
     * @param {BorderConstruction} border The border to compare this with
     * @returns {Boolean} Returns true if {border} is another Grass, otherwise false.
     */
    matchesBorder : function(border) {
      return (border.name === "Grass");
    }

  });
};

module.exports = Grasssi