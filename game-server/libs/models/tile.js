var mongoose = require("mongoose");
var Tile = require("./tile");

/**
 * This schema is the base schema describes a tile and overriden by tiles in the gamepacks.
 *
 * Tiles are made of different connectable types, such as Grass, Roads, or Castles. Every tile
 * has 12 pieces which span the borders of the tile. These are connectable, and connected border
 * pieces form constructions. For example, a road that goes from the tile's west side to its north side
 * and has grass on both sides of it, has three different constructions (the road and the grass on each
 * side of it). These constructions may also have special features. For example, constructions that are
 * made of Castles may have a Banner, and a Roads may have an Inn.
 * Tiles are also made of internal pieces, such as Monasteries.
 * @params {Number} priority The priority for this tile. Default is 1, which goes for all regular tiles.
 * Starting tiles (e.g. River) should have a priority of 2 or higher. For example, the River Lake has a priority
 * of 2, the regular rivers have a priority of 3, and the Mountain 4.
 */
var schema = mongoose.Schema({
  name : { type : String },
  borders : {
    "positions" : [Number],
    "type" : {}
  },
  internals : {},
  priority : { "type" : Number, "default" : 1 }
});

/**
 * This function is used to check if this tile can be placed on a specific
 * position. Some tiles, such as the River tile expansions, and the Abbey,
 * have special requirements. For example, the River tiles needs to have
 * matching borders, but they also have to be connected to another river.
 * This function should be overriden by such tiles.
 * @params {Number} x The coordinate where the tile is placed on the board.
 * @params {Number} y The coordinate where the tile is placed on the board.
 * @params {Number} rotation The tile's rotation
 * @params {Board} board The board onto which the tile is placed.
 * @returns {Boolean} Returns true if the tile can be placed, otherwise false.
 */
schema.methods.canBePlacedAt = function(x, y, rotation, board) {
  return this.adjacentTilesBordersMatch(x, y, rotation, board);
};

schema.methods.adjacentTilesBordersMatch = function(x, y, rotation, board) {
  /* Checking with each tile if they allow themselves to be placed there */
  var eastMatch = this.tilesMatch(rotation, board.getTile(x+1,y), Directions.EAST);
  var westMatch = this.tilesMatch(rotation, board.getTile(x-1,y), Directions.WEST);
  var northMatch = this.tilesMatch(rotation, board.getTile(x,y+1), Directions.NORTH);
  var southMatch = this.tilesMatch(rotation, board.getTile(x,y-1), Directions.SOUTH);

  return eastMatch && westMatch && northMatch && southMatch;
};

/* TODO: Refactoring. */
schema.methods.tilesMatch = function(thisTilesRotation, otherTile, directionToOtherTile) {
  /* Matching is not a problem if there's no tile to be matched against */
  if (!otherTile) {
    return true;
  }

  var otherTilesBorders = otherTile.tile.getBorders(Directions.oppositeOf(directionToOtherTile));
  var thisTilesSidesWithRotation = Directions.rotateDirection(directionToOtherTile, thisTilesRotation);
  var thisTilesBorders = this.getBorders(thisTilesSidesWithRotation);

  var allMatches = true;
  for (var i = 0; i < thisTilesBorders.length; i++) {
    if (!thisTilesBorders[i].matches(otherTilesBorders[i]) ||
        !otherTilesBorders[i].matches(thisTilesBorders[i])) {
      allMatches = false;
      break;
    }
  }

  return allMatches;
};

/*
 *  @params {Number} position The position of the tile's borders
 *  @returns {BorderType} The border type at position {position}
 */
schema.methods.getTypeAtPosition = function(position) {
  return this.getBorderConstruction(position).type;
};

/**
 * @params {Direction} direction The direction of the tile of which the borders are to be returned
 * @returns {Array} The three border types that make up the border in the tile's {direction} direction
 */
schema.methods.getBorders = function(direction) {
  var returnedBorder = [];

  switch (direction) {
    case Directions.NORTH :
      returnedBorder.push(this.getTypeAtPosition(0));
      returnedBorder.push(this.getTypeAtPosition(1));
      returnedBorder.push(this.getTypeAtPosition(2));
      break;
    case Directions.EAST :
      returnedBorder.push(this.getTypeAtPosition(3));
      returnedBorder.push(this.getTypeAtPosition(4));
      returnedBorder.push(this.getTypeAtPosition(5));
      break;
    case Directions.SOUTH :
      returnedBorder.push(this.getTypeAtPosition(6));
      returnedBorder.push(this.getTypeAtPosition(7));
      returnedBorder.push(this.getTypeAtPosition(8));
      break;
    case Directions.WEST :
      returnedBorder.push(this.getTypeAtPosition(9));
      returnedBorder.push(this.getTypeAtPosition(10));
      returnedBorder.push(this.getTypeAtPosition(11));
      break;
  }

  return returnedBorder;
};

/* Retrieve the border that's on the {position}, taking {rotation} into consideration */
schema.methods.getBorderConstruction = function(position) {
  var componentHoldingPosition = this.borders.filter(function(border) {
    var containedPosition = border.positions.some(function(pos) {
      return pos == position;
    });
    return containedPosition;
  });
  return componentHoldingPosition[0];
};

/**
 * Helper to make the code more readable.
 */
var Rotations = {
  NONE   : 0,
  ONCE   : 1,
  TWICE  : 2,
  THRICE : 3
};

/**
 * This class describes directions, and helps make the code more readable, and keeps track of which
 * positions transalte to which direction.
 */
var Directions = {
  NORTH : 0,
  EAST  : 1,
  SOUTH : 2,
  WEST  : 3,

  /* Directions opposite to {direction} */
  oppositeOf : function(direction) {
    return (direction + 2) % 4;
  },

  forPositions : function(positions) {
    var self = this;
    var returnedDirections = [];
    positions.forEach(function(position) {
      var direction = self.forPosition(position);
      if (returnedDirections.indexOf(direction) == -1) {
        returnedDirections.push(direction);
      }
    });
    return returnedDirections;
  },

  /* Direction that is in the same direction as {position} */
  forPosition : function(position) {
    if ([0,1,2].indexOf(position) != -1) {
      return 0;
    }
    if ([3,4,5].indexOf(position) != -1) {
      return 1;
    }
    if ([6,7,8].indexOf(position) != -1) {
      return 2;
    }
    if ([9,10,11].indexOf(position) != -1) {
      return 3;
    }
  },

  rotateDirection : function(direction, rotation) {
    rotation = rotation % 4;
    return ((direction - rotation) + 4) % 4;
  }
};

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
    var positionsInDirection = positions.filter(function(position) {
      return Directions.forPosition(position) == direction;
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
  }
}

module.exports.schema = schema;
module.exports.Rotations = Rotations;
module.exports.Directions= Directions;
module.exports.Positions= Positions;