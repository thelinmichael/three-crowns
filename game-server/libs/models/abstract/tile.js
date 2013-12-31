var mongoose = require("mongoose");
var Tile = require("./tile");
var Directions = require("../../directions");
var Positions = require("../../tile-positions");

/**
 * This schema is the base schema describes a tile and overriden by tiles in the gamepacks.
 *
 * @params {Array} internals An array of {Internal} tile components.
 * @params {Number} priority The priority for this tile.
 */
var schema = mongoose.Schema({
  name : { type : String },
  areas : {
    connectables : ['Connectable'],
    internals : ['Internal']
  }
});

/**
 * This function is used to check if this tile can be placed on a specific
 * position. Some tiles, such as the River tile expansions,
 * have special requirements. For example, the River tiles needs to have
 * matching borders, but they also have to be connected to another river.
 * This function should be overriden by such tiles.
 *
 * @params {Number} x The x coordinate where the tile is placed on the board.
 * @params {Number} y The y coordinate where the tile is placed on the board.
 * @params {Number} rotation The tile's rotation
 * @params {Board} board The board onto which the tile is placed.
 * @returns {Boolean} Returns true if the tile can be placed, otherwise false.
 */
schema.methods.canBePlacedAt = function(x, y, rotation, board) {
  return this.adjacentTilesBordersMatch(x, y, rotation, board);
};

/**
 * @params {Direction} direction The direction of the tile of which the borders are to be returned
 * @returns {Array} The three border types that make up the border in the tile's {direction} direction
 */
schema.methods.getAreaTypesInDirection = function(direction) {
  var self = this,
      returnedAreaTypes = [];

  var positions = Positions.inDirection(direction);
  positions.forEach(function(position) {
    returnedAreaTypes.push(self.getAreaTypeAtPosition(position));
  });
  return returnedAreaTypes;
};

schema.methods.getAreaTypesAdjacentToDirection = function(direction) {
  return this.getAreaTypesInDirection(Directions.oppositeOf(direction));
};

/**
 *  @params {Number} position The position of the tile's borders
 *  @returns {AreaType} The border type at position {position}
 */
schema.methods.getAreaTypeAtPosition = function(position) {
  return this.getConnectableAreaAtPosition(position).areaType;
};

/**
 * Retrieve the border that's on the {position}, taking {rotation} into consideration
 * @params {Number} position The position that this construction contains
 */
schema.methods.getConnectableAreaAtPosition = function(position) {
  var componentHoldingPosition = this.areas.connectables.filter(function(connectableArea) {
    var containedPosition = connectableArea.positions.some(function(pos) {
      return pos == position;
    });
    return containedPosition;
  });
  return componentHoldingPosition[0];
};

schema.methods.getConnectableAreasOfType = function(areaTypeName) {
  return this.areas.connectables.filter(function(area) {
    return area.getType().getName() == areaTypeName;
  });
};

schema.methods.getInternalAreasOfType = function(areaTypeName) {
  return this.areas.internals.filter(function(area) {
    return area.getType().getName() == areaTypeName;
  });
};

/**
 * Used to decide if tiles that are adjacent to the position {x},{y} on the
 * {board} fit this tile if it's placed on the board with a rotation of {rotation}.
 *
 * @params {Number} x The x coordinate on the board
 * @params {Number} y The y coordinate on the board
 * @params {Number} rotation The rotation of this tile
 * @params {Board} board The board where the adjacent tiles are placed
 */
schema.methods.adjacentTilesBordersMatch = function(x, y, rotation, board) {
  var eastMatch = this.tilesMatch(rotation, board.getTile(x+1,y), Directions.EAST);
  var westMatch = this.tilesMatch(rotation, board.getTile(x-1,y), Directions.WEST);
  var northMatch = this.tilesMatch(rotation, board.getTile(x,y+1), Directions.NORTH);
  var southMatch = this.tilesMatch(rotation, board.getTile(x,y-1), Directions.SOUTH);

  return eastMatch && westMatch && northMatch && southMatch;
};


schema.methods.tilesMatch = function(thisTilesRotation, otherTile, directionToOtherTile) {
  if (!otherTile) {
    return true;
  }

  /* TODO: Take other tiles rotation into consideration */
  var thisTilesSidesWithRotation = Directions.rotateClockwise(directionToOtherTile, thisTilesRotation);

  var otherTilesSide = otherTile.tile.getAreaTypesAdjacentToDirection(directionToOtherTile);
  var thisTilesSide = this.getAreaTypesInDirection(thisTilesSidesWithRotation);

  return thisTilesSide.every(function(areaType, index) {
    return areaType.matches(otherTilesSide[(index-2) * -1]);
  });
};

module.exports.schema = schema;