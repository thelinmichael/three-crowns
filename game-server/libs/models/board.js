var mongoose = require("mongoose");
var Directions = require("./tile").Directions;
var Rotations = require("./tile").Rotations;

/**
 * This model describes the board.
 * The board knows about the tiles placed on it, and in which
 * rotation the tile was placed. It also holds helper functionality
 * necessary to place tiles, meeples, etc on the board, as well as retrieve
 * information about what's been placed.
 */
var schema = mongoose.Schema({
  tiles : [{
    "x" : { "type" : Number },
    "y" : { "type" : Number },
    "tile" : ['Tile'], // This is bogus. There must surely be an easy way to define another Schema without creating an array.
    "rotation" : { "type": Number }
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
 * @returns {Object} Returns an object containing the tiles adjacent to {x},{y}.
 */
schema.methods.getAdjacentTiles = function(x, y) {
  var adjacentTiles = {};
  if (this.hasTile(x-1, y)) {
    adjacentTiles.west = this.getTile(x-1, y);
  }
  if (this.hasTile(x+1, y)) {
    adjacentTiles.east = this.getTile(x+1, y);
  }
  if (this.hasTile(x, y+1)) {
    adjacentTiles.north = this.getTile(x, y+1);
  }
  if (this.hasTile(x, y-1)) {
    adjacentTiles.south = this.getTile(x, y-1);
  }
  return adjacentTiles;
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
    "rotation" : rotation
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
    possiblePositions.push({ "x" : 0, "y" : 0, "rotations" : [Rotations.NONE, Rotations.ONCE, Rotations.TWICE, Rotations.TRICE] });
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
      "tile" : tileWithPosition[0].tile[0],
      "rotation" : tileWithPosition[0].rotation
    };
  } else if (tileWithPosition.length > 1) {
    throw new Error("Should never get here!");
  }
};

schema.methods.getTileInDirection = function(x, y, direction) {
  switch (direction) {
    case Directions.NORTH:
      return this.getTile(x, y+1);
      break;
    case Directions.EAST:
      return this.getTile(x+1, y);
      break;
    case Directions.SOUTH:
      return this.getTile(x, y-1);
      break;
    case Directions.WEST:
      return this.getTile(x-1, y);
      break;
    default:
      throw new Error("I should never get here!");
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

/**
 * Retrieve which tiles, and positions on those tiles, are involved in a construction.
 * @returns {Array} holding an object containing {x}, {y}, [{construction}]. */
schema.methods.getSpanningConstructions = function(x, y, construction) {

  /* No tile, no construction. */
  if (!this.hasTile(x,y)) {
    return [];
  }

  /* Keep track of which tiles that have been checked */
  var traversedTiles = [];

  /* Start out with this tile as the first */
  var constructionsToCheck = [{ "x" : x, "y" : y, "construction" : construction }];

  while (constructionsToCheck.length > 0) {
    /* Use the top tile on the stack */
    var check = constructionsToCheck.pop();

    /* Check if it is already among the saved constructions */
    var alreadyTraversed = traversedTiles.some(function(traversedTile) {
      var tileIsTraversed = (traversedTile.x == check.tile.x && traversedTile.y == traversedTile.y);
      var constructionTraversed = traversedTile.constructions.some(function(traversedConstruction) {
        traversedConstruction.constructionType.getName() == check.construction.constructionType.getName() &&
        traversedConstruction.positions.compare(check.construction.positions);
      });
    });
    if (alreadyTraversed) {
      continue;
    }

    /* Save the tile's position, the positions the construction is made of */
    traversedTiles.push(check);

    /* Get tiles adjacent to the positions that the latest construction is connected to (regard rotation) */
    var adjacentPositions = Directions.forPositions(check.construction.positions);
    var rotation = this.getTile(x, y).rotation;

    /* If the adjacent tiles are of the same type, add them to the constructions to check */
    console.log(check.construction.positions);
    console.log(adjacentPositions);
  }

  return traversedTiles;

};

/* Adding comparison function.
   TODO: Move this out to a module that holds these kinds of additions. */
Array.prototype.compare = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

module.exports = mongoose.model('Board', schema);
module.exports.schema = schema;