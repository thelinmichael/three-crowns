var Directions = require("./directions");

var Positions = {

  rotate : function(positions, rotation) {
    var rotatedPositions = positions.map(function(position) {
      rotation = rotation % 4;
      return (position + rotation*3) % 12;
    });
    return rotatedPositions;
  },

  counterRotate : function(positions, rotation) {
    var rotatedPositions = positions.map(function(position) {
      rotation = rotation % 4;
      return ((position - rotation*3) + 12) % 12;
    });
    return rotatedPositions;
  },

  filterForDirection : function(positions, direction) {
    var self = this;
    var positionsInDirection = positions.filter(function(position) {
      return self.toDirection(position) == direction;
    });
    return positionsInDirection;
  },

  inDirection : function(direction) {
    switch (direction) {
      case Directions.NORTH:
        return [0,1,2];
      case Directions.EAST:
        return [3,4,5];
      case Directions.SOUTH:
        return [6,7,8];
      case Directions.WEST:
        return [9,10,11];
      default:
        throw new Error("I should never get here");
    }
  },

  oppositeOf : function(position) {
    var indexOnRow = position % 3;
    var compensation;
    switch (indexOnRow) {
      case 0:
        compensation = 2;
        break;
      case 1:
        compensation = 0;
        break;
      case 2:
        compensation = -2;
        break;
    }
    return (position + 6 + compensation) % 12;
  },

  toDirections : function(positions) {
    var directions = [],
        self = this;

    positions.forEach(function(position) {
      if ([0,1,2].indexOf(position) > -1) { directions.push(Directions.NORTH); }
      if ([3,4,5].indexOf(position) > -1) { directions.push(Directions.EAST); }
      if ([6,7,8].indexOf(position) > -1) { directions.push(Directions.SOUTH); }
      if ([9,10,11].indexOf(position) > -1) { directions.push(Directions.WEST); }
    });

    directions = directions.filter(function(direction) {
      return directions[directions.indexOf(direction)];
    });

    return directions;
  },

  toDirection : function(position) {
    if ([0,1,2].indexOf(position) > -1) { return Directions.NORTH; }
    if ([3,4,5].indexOf(position) > -1) { return Directions.EAST; }
    if ([6,7,8].indexOf(position) > -1) { return Directions.SOUTH; }
    if ([9,10,11].indexOf(position) > -1) { return Directions.WEST; }
  }

};

module.exports = Positions;