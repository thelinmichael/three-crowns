/**
 * This class describes directions, and helps make the code more readable, and keeps track of which
 * positions transalte to which direction.
 */
var Directions = {
  NORTH : 0,
  EAST  : 1,
  SOUTH : 2,
  WEST  : 3,

  /* Directions on the opposite side of {direction} */
  oppositeOf : function(direction) {
    return (direction + 2) % 4;
  },

  rotateCounterClockwise : function(direction, rotation) {
    if (direction instanceof Array) {
      var rotated = direction.map(function(dir) {
        return _rotateCounterClockwise(dir, rotation);
      });
      return rotated;
    } else {
      return _rotateCounterClockwise(direction, rotation);
    }
  },

  rotateClockwise : function(direction, rotation) {
    if (direction instanceof Array) {
      var rotated = direction.map(function(dir) {
        return _rotateClockwise(dir, rotation);
      });
      return rotated;
    } else {
      return _rotateClockwise(direction, rotation);
    }
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