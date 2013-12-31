var Positions = require("./tile-positions");
var Directions = require("./directions");

var BoardTraverser = {

  getTileAreasCoveredByConnectableArea : function(x, y, area, board) {

    /* No tile, no construction. */
    if (!board.hasTile(x,y)) {
      return [];
    }

    var traversedAreas = [];

    var areasLeftToCheck = [{ "x" : x, "y" : y, "area" : area }];

    while (areasLeftToCheck.length > 0) {

      var areaBeingChecked = areasLeftToCheck.pop();

      /* Check if it is already among the saved constructions */
      if (this.isTraversed(traversedAreas, areaBeingChecked)) {
        continue;
      }

      /* Stop traversing if it's not the same type */
      if (areaBeingChecked.area.areaType.name != area.areaType.name) {
        continue;
      }

      /* It's of the same type, so add it to the traversed areas */
      traversedAreas.push(areaBeingChecked);

      /* Get tiles adjacent to the positions that the latest construction is connected to (regard rotation) */
      var tilesRotation = board.getTile(areaBeingChecked.x, areaBeingChecked.y).rotation;
      var rotatedPositions = Positions.rotate(areaBeingChecked.area.positions, tilesRotation);
      var adjacentDirections = Positions.toDirections(rotatedPositions);

      var adjacentAreas = this.traverseAdjacentAreas(areaBeingChecked.x, areaBeingChecked.y, rotatedPositions, adjacentDirections, board);

      areasLeftToCheck = areasLeftToCheck.concat(adjacentAreas);
    }

    return traversedAreas;
  },

  traverseAdjacentAreas : function(x, y, positions, directions, board) {
    var adjacentAreas = [];

    directions.forEach(function(direction) {
      /* Get adjacent tile */
      var tileOnBoard = board.getTileInDirection(x, y, direction);

      /* Get which of the positions on the adjacent tile that borders to the construction */
      var connectingPositions = Positions.filterForDirection(positions, directions);
      var adjacentTilesConnectingPositions = connectingPositions.map(function(position) {
        return Positions.oppositeOf(position);
      });

      /* Get the construction */
      var adjacentTilesRotatedPositions = Positions.counterRotate(adjacentTilesConnectingPositions, tileOnBoard.rotation);
      var adjacentArea = tileOnBoard.tile.getConnectableAreaAtPosition(adjacentTilesRotatedPositions[0]);

      /* Add to the stack of constructions that will be checked */
      adjacentAreas.push({ "x" : tileOnBoard.x, "y" : tileOnBoard.y, "area" : adjacentArea });
    });

    return adjacentAreas;
  },

  isTraversed : function(traversedAreas, aboutToTraverseArea) {
    return traversedAreas.some(function(traversedArea) {
        var tileIsTraversed = (traversedArea.x == aboutToTraverseArea.x && traversedArea.y == aboutToTraverseArea.y);
        var areaIsTraversed = traversedArea.area.positions.compare(aboutToTraverseArea.area.positions);
        return (tileIsTraversed && areaIsTraversed);
    });
  }
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
};

module.exports = BoardTraverser;