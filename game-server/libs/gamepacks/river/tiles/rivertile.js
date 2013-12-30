/* All river tiles extend this schema. This schema, in turn extends the normal tile schema. */

var mongoose = require("mongoose");
var Schema = require("../../../models/tile").schema;
var Directions = require("../../../models/tile").Directions;
var Rotations = require("../../../models/tile").Rotations;

/**
 * Overriding the default canBePlacedAt method found in the base tile schema
 */
Schema.methods.canBePlacedAt = function(x, y, rotation, board) {
  if (!this.adjacentTilesBordersMatch(x, y, rotation, board)) {
    return false;
  }

  if (!this.isConnectedToOtherRiver(x, y, rotation, board)) {
    return false;
  }

  return true;
};

/* Someone should throw holy water at this function. */
Schema.methods.isConnectedToOtherRiver = function(x, y, rotation, board) {

  if (!rotation) {
    rotation = Rotations.NONE;
  }

  // This tile's river borders are on these positions
  var riverConstructions = this.constructions.filter(function(construction) {
    return construction.type.name == "River";
  });

  var oneRiverMatched = riverConstructions.some(function(riverConstruction) {
    /* Get the directions (north, east..) where the river positions for this tile are */
    var directionsWithRiver = Directions.forPositions(riverConstruction.positions);

    /* Go through each of these directions.. */
    var someMatchingDirectionContainedRiver = directionsWithRiver.some(function(directionWithRiver) {

      /* And check if the tile next to it, if it exists, has a river in the opposite direction as this tile */
      if (board.hasTileInDirection(x, y, directionWithRiver)) {

        /* Get adjacent tile in specific direction from this tile's position  */
        var adjacentTile = board.getTileInDirection(x, y, directionWithRiver);

        /* Check if the adjacent tile's border contains a river on the side that it is bordering this tile */
        var direction = Directions.oppositeOf(directionWithRiver);

        var borderContainedRiver = adjacentTile.tile.getBorders(direction).some(function(type) {
          return type.name == "River";
        });

        return borderContainedRiver;
      } else {
        return false;
      }
    });

    return someMatchingDirectionContainedRiver;
  });

  return oneRiverMatched;
};

module.exports.schema = Schema;