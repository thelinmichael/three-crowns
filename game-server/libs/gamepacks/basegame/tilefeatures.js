/**
 * The different types constructions can be made of.
 */
var ConstructionTypes = {
  grass : {
    name : "Grass",
    /**
     * Grass can never be completed.
     */
    onBuildingComplete : function(tilesInvolved) {
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
     * Grass can never be completed.
    */
    isCompleted : function(tilesInvolved, board) {
      return false;
    },
    /**
     * Can only be placed next to tiles with Grass border.
     * Does not override what the other tile thinks.
     */
    matchesBorder : function(border) {
      return {
        matches : (border.name === "Grass"),
        overRidesOtherTilesMatching : false
      }
    }
  },
  road : {
    name : "Road",
    onBuildingComplete : function(tilesInvolved) {
      return {
        points : tilesInvolved.length
      }
    },
    onGameFinish : function(tilesInvolved, board) {
      return {
        points : tilesInvolved.length
      }
    },
    /**
     * Completed when all the tile  are connected.
     */
    isBuildingCompleted : function(position, board) {

    },
    /**
     * Can only be placed next to tiles with Road border.
     * Does not override what the other tile thinks.
     */
    matchesBorder : function(border) {
      return {
        matches : (border.name === "Road"),
        overRidesOtherTilesMatching : false
      }
    }
  },
  castle : {
    name : "Castle",
    onBuildingComplete : function(tilesInvolved) {
      return {
        points : tilesInvolved.length
      }
    },
    isBuildingCompleted : function(position, board) {
      return {

      }
    },
    /**
     * Can only be placed next to tiles with Road border.
     * Does not override what the other tile thinks.
     */
    matchesBorder : function(border) {
      return {
        matches : (border.name === "Castle"),
        overRidesOtherTilesMatching : false
    }
  }
};

/**
 * The different types an internal can be made of.
 */
var InternalTypes = [
  cloister : {
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
  }
];

/**
 * The different types a construction's special feature can be made of.
 */
var SpecialFeatureTypes = [
  penant : {
    name : "Penant",
    onBuildingComplete : function() {
      return {
        points : 1
      };
    },
    onGameFinish : function() {
      return {
        points : 1
      };
    }
  }
];


exports.ConstructionTypes = ConstructionTypes;
exports.InternalTypes = InternalTypes;
exports.SpecialFeatureTypes = SpecialFeatureTypes;