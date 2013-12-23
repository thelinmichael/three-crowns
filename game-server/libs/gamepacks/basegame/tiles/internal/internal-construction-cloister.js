var InternalConstruction = require("../../../../models/tile-internal-construction.js");

var Cloister = function() {

  return new InternalConstruction({

    name : "Cloister",

    /**
    * The tiles involved is irrelevant, simply return
    * nine points.
    */
    onBuildingComplete : function(tilesInvolved) {
      return {
        points : 9
      };
    },

    /**
    * Get the number of tiles adjacent to this one
    * from the board and return a number of points
    * equalling that.
    */
    onGameFinish : function(position, board) {
      return {
        points : 1 + board.getAdjacentTiles(position).length;
      }
    },

    /**
    * Building is completed when all adjacent tiles
    * have been placed.
    */
    isBuildingCompleted : function(position, board) {
      return (board.getAdjacentTiles(position).length === 8);
    }
  });

};

module.exports = Cloister;