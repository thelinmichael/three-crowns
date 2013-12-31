/**
 * All river tiles extend this schema. This schema, in turn extends the normal tile schema.
 */

var mongoose = require("mongoose");
var Schema = require("../../../../models/abstract/tile").schema;
var Directions = require("../../../../directions");
var Positions = require("../../../../tile-positions");
var Rotations = require("../../../../tile-rotations");

/**
 * Overriding the default canBePlacedAt method found in the base tile schema.
 *
 * @param {Number} x The coordinate on the x-axis on the board where this tile is going to be placed
 * @param {Number} y The coordinate on the y-axis on the board where this tile is going to be placed
 * @param {Number} rotation
 * @param {Board} board
 * @returns {Boolean} Returns true if this tile can be placed on {x},{y} on the {board} with {rotation}
 * TODO: Should check if the river is making a u-turn.
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

/**
 * A river must be connected to another river if there's one available.
 *
 * @param {Number} x The coordinate on the x-axis on the board where this tile is going to be placed
 * @param {Number} y The coordinate on the y-axis on the board where this tile is going to be placed
 * @param {Number} rotation
 * @param {Board} board
 * @returns {Boolean} Returns true if the river is placed so that it connects to another river, otherwise false
 */
Schema.methods.isConnectedToOtherRiver = function(x, y, rotation, board) {

  var riverBorders = this.getConnectableAreasOfType("River");

  var oneRiverMatched = riverBorders.some(function(riverBorder) {

    var directionsWithRiver = Positions.toDirections(riverBorder.positions);

    var someMatchingDirectionContainedRiver = directionsWithRiver.some(function(directionWithRiver) {

      var directionWithRiverWhenRotated = Directions.rotateClockwise(directionWithRiver, rotation);

      /* And check if the tile next to it, if it exists, has a river in the opposite direction as this tile */
      if (board.hasTileInDirection(x, y, directionWithRiverWhenRotated)) {

        /* Get adjacent tile in specific direction from this tile's position  */
        var adjacentTile = board.getTileInDirection(x, y, directionWithRiverWhenRotated);

        /* Check if the adjacent tile's border contains a river on the side that it is bordering this tile */
        var direction = Directions.oppositeOf(directionWithRiverWhenRotated);

        var borderContainedRiver = adjacentTile.tile.getAreaTypesInDirection(direction).some(function(areaType) {
          return areaType.name == "River";
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