var BorderConstructionExtra = require("../../../../models/tile-border-construction-extra.js");

var Penant = function() {

  return new BorderConstructionExtra({

    name : "Grass",

    /**
     * @returns {Object} Returns an object containing the points given
     */
    onBuildingComplete : function(tilesInvolved) {
      return {
        points : 1
      };
    },

    /**
     * @returns {Boolean} True if building is completed, otherwise false
     */
    isBuildingCompleted : function(position, board) {
      throw new Error("Not implemented!");
    },

    /**
     * Pentants will give one point extra.
     */
    onGameFinish : function(tilesInvolved, board) {
      return {
        points : 1
      };
    }

  });
};

module.exports = Penant;