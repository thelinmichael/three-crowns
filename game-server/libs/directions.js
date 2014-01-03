/**
 * This class describes directions that a tile can face.
 * North is the same as up.
 */

var Directions = {
  NORTH : 0,
  EAST  : 1,
  SOUTH : 2,
  WEST  : 3,

  /**
   * @param {direction} Number A direction
   * @returns {Number} Returns a number corresponding to the opposite side of {direction}
   */
  oppositeOf : function(direction) {
    return (direction + 2) % 4;
  },

  /**
   * @param {Number|Array} directions The direction or directions that should be rotated counter clockwise
   * @returns {Number|Array} The {directions} with rotated values
   * Example: rotateCounterClockwise(Directions.NORTH, Rotations.ONCE) -> Directions.WEST
   */
  rotateCounterClockwise : function(directions, rotation) {
    return _rotate(direction, rotation, _rotateCounterClockwise);
  },

  /**
   * @param {Number|Array} directions The direction or directions that should be rotated clockwise
   * @returns {Number|Array} The {directions} with rotated values
   * Example: rotateClockwise(Directions.NORTH, Rotations.ONCE) -> Directions.EAST
   */
  rotateClockwise : function(directions, rotation) {
    return _rotate(direction, rotation, _rotateClockwise);
  }

};

var _rotate = function(direction, rotation, rotationFunction) {
  if (direction instanceof Array) {
    var rotated = direction.map(function(dir) {
      return rotationFunction(dir, rotation);
    });
    return rotated;
  } else {
    return rotationFunction(direction, rotation);
  }
};

var _rotateClockwise = function(direction, rotation) {
  rotation = rotation % 4;
  return (direction + rotation) % 4;
};

var _rotateCounterClockwise = function(direction, rotation) {
  rotation = rotation % 4;
  return ((direction - rotation) + 4) % 4;
};

module.exports = Directions;