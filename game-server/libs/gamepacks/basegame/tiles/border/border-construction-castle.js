var BorderConstruction = require("../../../../models/tile-border-construction.js");

var Castle = function() {

  return new BorderConstruction({

    name : "Castle",

    /**
     * This function is run when a building of this type is completed.
     * @returns {Object} Returns an object containing the points given
     */
    onBuildingComplete : function(tilesInvolved) {
      return {
        points : 2*tilesInvolved.length
      }
    },

    /**
     * @returns {Boolean} True if building is completed, otherwise false
     */
    isBuildingCompleted : function(position, board) {
      throw new Error("Not implemented!");
    },

    /**
     * @param {BorderConstruction} border The border to compare this with
     * @returns {Boolean} Returns true if {border} is another Castle, otherwise false.
     */
    matchesBorder : function(border) {
      return (border.name === "Castle");
    }

  });
};


exports.module = Castle;