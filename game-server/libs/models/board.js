var mongoose = require("mongoose");
var Directions = require("../directions");
var Rotations = require("../tile-rotations");
var Positions = require("../tile-positions");
var BoardTraverser = require("../board-traverser");

/**
 * This model describes the board.
 * The board knows about the tiles placed on it, and in which
 * rotation the tile was placed. It also holds helper functionality
 * necessary to place tiles, meeples, etc on the board, as well as retrieve
 * information about what's been placed.
 */
var schema = mongoose.Schema({
  tiles : [{
    x   : { "type" : Number },
    y   : { "type" : Number },
    tile : ['Tile'],
    rotation : { "type": Number },
    meeplePlacements : [{
      tileArea : {},
      meeple   : {}
    }]
  }]
});

/**
 * @params {Number} x The coordinate on the x axis
 * @params {Number} y The coordinate on the y axis
 * @returns {Boolean} Returns true if there are tiles adjacent to the position {x},{y}.
 */
schema.methods.hasAdjacentTile = function(x, y) {
  return (this.hasTile(x-1, y) ||
          this.hasTile(x+1, y) ||
          this.hasTile(x, y-1) ||
          this.hasTile(x, y+1));
};

/**
 * @params {Number} x The coordinate on the x axis
 * @params {Number} y The coordinate on the y axis
 * @returns {Array} Returns an object containing the tiles adjacent to {x},{y}.
 */
schema.methods.getAdjacentTiles = function(x, y) {
  var adjacentTiles = [];
  if (this.hasTile(x-1, y)) {
    adjacentTiles.push(this.getTile(x-1, y));
  }
  if (this.hasTile(x+1, y)) {
    adjacentTiles.push(this.getTile(x+1, y));
  }
  if (this.hasTile(x, y+1)) {
    adjacentTiles.push(this.getTile(x, y+1));
  }
  if (this.hasTile(x, y-1)) {
    adjacentTiles.push(this.getTile(x, y-1));
  }
  return adjacentTiles;
};

schema.methods.getDiagonalTiles = function(x, y) {
  var diagonalTiles = [];
  if (this.hasTile(x-1, y-1)) {
    diagonalTiles.push(this.getTile(x-1,y-1));
  }
  if (this.hasTile(x+1, y+1)) {
    diagonalTiles.push(this.getTile(x+1, y+1));
  }
  if (this.hasTile(x-1, y+1)) {
    diagonalTiles.push(this.getTile(x-1, y+1));
  }
  if (this.hasTile(x+1, y-1)) {
    diagonalTiles.push(this.getTile(x-1, y+1));
  }
  return diagonalTiles;
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 * @throws Will throw if {tile} cannot be placed on {x},{y} with rotation {rotation}
 */
schema.methods.placeTile = function(x, y, tile, rotation) {
  if (!this.canPlaceTile(x, y, tile, rotation)) {
    throw new Error("Tried to place tile at invalid position.");
  }

  var newTileOnBoard = {
    "x" : x,
    "y" : y,
    "tile" : tile,
    "rotation" : rotation,
    "meeplePlacements" : []
  };
  this.tiles.push(newTileOnBoard);
};

schema.methods.getNumberOfTiles = function() {
  return this.tiles.length;
};

/**
 * @params {Number} x
 * @params {Number} y
 * @params {Tile} tile
 * @params {Tile.Rotations} rotation The number of rotations
 */
schema.methods.canPlaceTile = function(x, y, tile, rotation) {

  /* Checking for first tile of the game */
  if (this.getNumberOfTiles() === 0) {
    return true;
  }

  /* Checking if the tile is already taken */
  if (this.hasTile(x, y)) {
    return false;
  }

  /* Checking if this tile has any adjacent tiles */
  if (!this.hasAdjacentTile(x, y)) {
    return false;
  }

  /* Checking for tile specific requirements */
  if (!tile.canBePlacedAt(x, y, rotation, this)) {
    return false;
  }

  return true;
};

/**
 *  @returns {Array} Returns an array containing {Number} x, {Number} y, {Number}
 *  where no tile is placed, but adjacent to some other tile.
 */
schema.methods.getPossiblePositions = function() {
  var self = this,
      possiblePositions = [];

  this.tiles.forEach(function(tileOnBoard) {
    var x = tileOnBoard.x;
    var y = tileOnBoard.y;

    if (!self.hasTile(x+1, y)) {
      possiblePositions.push({ "x" : x+1, "y" : y });
    }
    if (!self.hasTile(x-1, y)) {
      possiblePositions.push({ "x" : x-1, "y": y });
    }
    if (!self.hasTile(x, y-1)) {
      possiblePositions.push({ "x" : x, "y" : (y-1) });
    }
    if (!self.hasTile(x, y+1)) {
      possiblePositions.push({ "x" : x, "y" : (y+1) });
    }

  });

  return possiblePositions;
};

/**
 * @params {Tile} tile The tile to be placed on the board
 * @returns {Array} Returns an array of objects that consists of x : {Number}, y : {Number}, rotations : {Array} of {Number}
 */
schema.methods.getPossiblePlacementsForTile = function(tile) {
  var self = this,
      possiblePositions = [];

  /* There are no tiles on the board. The only available place is origo. */
  if (this.getNumberOfTiles() === 0) {
    possiblePositions.push({ "x" : 0, "y" : 0, "rotations" : [Rotations.NONE, Rotations.ONCE, Rotations.TWICE, Rotations.THRICE] });
    return possiblePositions;
  }

  /* Check all tiles that are placed on the board, and if they match with {tile} */
  this.tiles.forEach(function(tileOnBoard) {
    var rotations = [Rotations.NONE, Rotations.ONCE, Rotations.TWICE, Rotations.THRICE];
    rotations.forEach(function(rotation) {
      var x = tileOnBoard.x;
      var y = tileOnBoard.y;
      if (self.canPlaceTile(x+1, y, tile, rotation)) {
        _addPosition(possiblePositions, x+1, y, rotation);
      }
      if (self.canPlaceTile(x-1, y, tile, rotation)) {
        _addPosition(possiblePositions, x-1, y, rotation);
      }
      if (self.canPlaceTile(x, y-1, tile, rotation)) {
        _addPosition(possiblePositions, x, y-1, rotation);
      }
      if (self.canPlaceTile(x, y+1, tile, rotation)) {
        _addPosition(possiblePositions, x, y+1, rotation);
      }
    });
  });

  return possiblePositions;
};

var _addPosition = function(positions, x, y, rotation) {
  var existingEntry = positions.filter(function(position) {
    return position.x === x && position.y === y;
  });
  if (existingEntry.length > 0) {
    existingEntry[0].rotations.push(rotation);
  } else {
    positions.push({ "x" : x, "y" : y, "rotations" : [rotation] });
  }
};

schema.methods.coordinateIsSurrounded = function(x, y) {
  return (this.getAdjacentTiles(x, y).length == 4 &&
          this.getDiagonalTiles(x, y).length == 4);
};

/**
 * @params {Number} x
 * @params {Number} y
 * @returns {Tile|undefined} The tile at position {x},{y}, otherwise undefined
 */
schema.methods.getTile = function(x, y) {
  var tileWithPosition = this.tiles.filter(function(tileOnBoard) {
    return (tileOnBoard.x === x && tileOnBoard.y === y);
  });
  if (tileWithPosition.length == 1) {
    return {
      "x" : tileWithPosition[0].x,
      "y" : tileWithPosition[0].y,
      "tile" : tileWithPosition[0].tile[0],
      "rotation" : tileWithPosition[0].rotation,
      "meeplePlacements" : tileWithPosition[0].meeplePlacements
    };
  } else if (tileWithPosition.length > 1) {
    throw new Error("Should never get here!");
  }
};

schema.methods.getTileInDirection = function(x, y, direction) {
  switch (direction) {
    case Directions.NORTH:
      return this.getTile(x, y+1);
    case Directions.EAST:
      return this.getTile(x+1, y);
    case Directions.SOUTH:
      return this.getTile(x, y-1);
    case Directions.WEST:
      return this.getTile(x-1, y);
  }
};

/**
 * @params {Number} x
 * @params {Number} y
 * @returns {Boolean} True if the board has a tile at position {x},{y}, otherwise false.
 */
schema.methods.hasTile = function(x, y) {
  return (this.getTile(x,y) !== undefined);
};


schema.methods.hasTileInDirection = function(x, y, direction) {
  return (this.getTileInDirection(x, y, direction) !== undefined);
};

schema.methods.getLastPlayedTile = function() {
  return this.tiles[this.tiles.length - 1];
};

schema.methods.placeMeeple = function(x, y, tilearea, meeple) {
  if (!this.hasTile(x,y)) {
    throw new Error("No tile on position.");
  }

  /* Check if there's already a meeple on the connectable area that is on the position */

  /* Place meeple on position */
  var tileOnBoard = this.getTile(x, y);

  /* TODO: If internal, place it on the internal instead */
  tileOnBoard.meeplePlacements.push({ "tileArea" : tilearea, "meeple" : meeple });
};

schema.methods.getAreasFreeFromMeeplesOnTile = function(tileOnBoard) {
  var self = this;
  var connectableAreasOnTile = tileOnBoard.tile[0].getConnectableAreas();

  var meepleFreeConnectableAreas = connectableAreasOnTile.filter(function(area) {
    var connectedAreas = self.getTileAreasCoveredByConnectableArea(tileOnBoard.x, tileOnBoard.y, area);
    var hasMeepleAlready = self.connectedAreasHasMeeple(connectedAreas);
    return !hasMeepleAlready;
  });

  var meeplePlaceableConnectableAreas = meepleFreeConnectableAreas.filter(function(area) {
    return area.areaType.meeplePlaceable;
  });

  var internalAreas = tileOnBoard.tile[0].getInternalAreas();
  var meepleFreeInternalAreas = internalAreas.filter(function(internalArea) {
    return !self.internalAreaHasMeeple(tileOnBoard.x, tileOnBoard.y, internalArea);
  });

  var allMeepleFreeAreas = meeplePlaceableConnectableAreas.concat(meepleFreeInternalAreas);

  if (allMeepleFreeAreas.length > 0) {
    return {
      "x" : tileOnBoard.x,
      "y" : tileOnBoard.y,
      "areas" : allMeepleFreeAreas
    };
  } else {
    return;
  }
};

schema.methods.connectedAreasHasMeeple = function(connectedAreas) {
  var self = this;
  return connectedAreas.some(function(connectedArea) {
    var tileOnBoard = self.getTile(connectedArea.x, connectedArea.y);
    var somePositionHasMeeple = tileOnBoard.meeplePlacements.some(function(meeplePlacement) {
      return connectedArea.area.matchingProperties(meeplePlacement.tileArea);
    });
    return somePositionHasMeeple;
  });
};

schema.methods.internalAreaHasMeeple = function(x, y, internalArea) {
  var tileOnBoard = this.getTile(x, y);
  return tileOnBoard.meeplePlacements.some(function(meeplePlacement) {
    return meeplePlacement.tileArea.matchingProperties(internalArea);
  });
};

/**
 * Retrieve which tiles, and positions on those tiles, are involved in a construction.
 * @returns {Array} holding an object containing {x}, {y}, [{borders}]. */
schema.methods.getTileAreasCoveredByConnectableArea = function(x, y, area) {
  return BoardTraverser.getTileAreasCoveredByConnectableArea(x, y, area, this);
};

schema.methods.isAreaFinished = function(x, y, area) {
  if (!this.hasTile(x,y)) {
    throw new Error("No tile at position " + x + "," + y);
  }

  var tileOnBoard = this.getTile(x,y);
  var areaExistsOnTile = tileOnBoard.tile.hasArea(area);
  if (!areaExistsOnTile) {
    throw new Error("The given area wasn't found on the tile at the given position");
  }

  var finished = area.isFinished(x, y, this);

  return finished;
};

module.exports = mongoose.model('Board', schema);
module.exports.schema = schema;