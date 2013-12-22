/**
 * Inns and Cathedrals doesn't have any new internal types.
 */
var InternalTypes = [];

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
]


exports.ConstructionTypes = ConstructionTypes;
exports.InternalTypes = InternalTypes;