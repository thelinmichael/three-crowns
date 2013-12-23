var BorderConstruction = require("../../../../models/tile-border-construction.js");

var Road = function() {

  return new BorderConstruction({

    name : "Road",

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
     * Road will give one points per tile that's involved.
     */
    onGameFinish : function(tilesInvolved, board) {
      return {
        points : tilesInvolved.length
      }
    },

    /**
     * @param {BorderConstruction} border The border to compare this with
     * @returns {Boolean} Returns true if {border} is another Road, otherwise false.
     */
    matchesBorder : function(border) {
      return (border.name === "Road");
    }

  });
};

module.exports = Road;