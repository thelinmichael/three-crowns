var mongoose = require("mongoose");
var Tile = require("./tile");

/**
 * This schema describes a tile.
 * Tiles are made of different connectable types, such as Grass, Roads, or Castles. Every tile
 * has 12 pieces which span the borders of the tile. These are connectable, and connected border
 * pieces form constructions. For example, a road that goes from the tile's west side to its north side
 * and has grass on both sides of it, has three different constructions (the road and the grass on each
 * side of it). These constructions may also have special features. For example, constructions that are
 * made of Castles may have a Penant, and a Roads may have an Inn.
 * Tiles are also made of internal pieces, such as Cloisters.
 */
var schema = mongoose.Schema({
  constructions : {},
  internals     : {}
});

/**
 * @params {Tile} otherTile The tile to compare this tile with
 * @returns {Boolean} True if the tile is the same as the tile compared with it, otherwise false
 */
schema.methods.sameAs = function(otherTile) {
  throw new Error("Not implemented!");
};

/**
 * @params {Tile.Rotations} rotation The rotation of this tile
 * @returns {Tile} This tile rotated like {Tile.Rotations}
 */
schema.methods.withRotation = function(rotation) {
  throw new Error("Not implemented!");
}

/**
 * Tile specific requirements when being placed on the board.
 * @params {Number} x The coordinate where the tile is placed on the board.
 * @params {Number} y The coordinate where the tile is placed on the board.
 * @params {Board} board The board onto which the tile is placed.
 * @returns {Boolean} Returns true if the tile can be placed, otherwise false.
 */
schema.methods.canBePlacedAt = function(x, y, board) {
  return this.adjacentTilesBordersMatch(x, y, board);
},

schema.methods.adjacentTilesBordersMatch = function(x, y, board) {
  /* Checking with each tile if they allow themselves to be placed there */
  return (_tilesMatch(board.getTile(x+1,y), Tile.Directions.EAST) &&
          _tilesMatch(board.getTile(x-1,y), Tile.Directions.WEST) &&
          _tilesMatch(board.getTile(x,y+1), Tile.Directions.NORTH) &&
          _tilesMatch(board.getTile(x,y-1), Tile.Directions.SOUTH));
}

var _tilesMatch : function(otherTile, directionToOtherTile) {
  /* Matching is not a problem if there's no tile to be matched against */
  if (!otherTile) {
    return true;
  }

  var otherTilesBorders = otherTile.getBorders(Tile.Directions.oppositeOf(directionToOtherTile));
  var thisTilesBorders = this.getBorders(directionToOtherTile);

  var allMatches = true;
  thisTilesBorders.forEach(function(border, index) {
    if (!border.matches(otherTilesBorders[index]) &&
        !otherTilesBorders.matches(border)) {
      allMatches = false;
    }
    /* Only one is OK, check if one of them is more important, such as Abbeys
     which can be placed anywhere */
    if ((!border.matches(otherTilesBorders[index]) &&
        otherTilesBorders.matches(border)) ||
        (border.matches(otherTilesBorders[index] &&
        !otherTilesBorders.matches(border)))) {
      if (border.priority > otherTilesBorders[index].priority) {
        allMatches = border.matches(otherTilesBorders[index]);
      } else {
        allMatches = otherTilesBorders.matches(border);
      }
    }
    if (!allMatches) {
      break;
    }
  });

  return allMatches;
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

/**
 *  @returns {Number} Returns the internal component's type, e.g. a Cathedral
 */
schema.methods.getInternal = function() {
  return this.components.internal;
};

/**
 *  @params {Number} position The position of the tile's borders
 *  @returns {ConstructionType} The construction type of the border at position {position}
 */
schema.methods.getTypeAtPosition = function(position) {
  var returnedType;
  this.components.forEach(function(component) {
    if (components.positions.indexOf(position) > -1) {
      returnedType = components.type;
      break;
    }
  });
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

var Directions = {
  NORTH : 0,
  EAST  : 1,
  SOUTH : 2,
  WEST  : 3,

  oppositeOf : function(direction) {
    return direction + 2 % 4;
  }
};

module.exports = mongoose.model('Tile', schema);
module.exports.Rotations = Rotations;