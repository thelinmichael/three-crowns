var mongoose = require("mongoose");
var Positions = require("../tile-positions");
var BoardTraverser = require("../board-traverser");

var ConnectableSchema = mongoose.Schema({
  positions : [Number],
  areaType : {},
  extras : []
});

ConnectableSchema.methods.isFinished = function(x, y, board) {
    return (BoardTraverser.getNumberOfOpenConnections(x, y, this, board) === 0);
};

ConnectableSchema.methods.getType = function() {
  return this.areaType;
};

ConnectableSchema.methods.matchingProperties = function(otherTileArea) {
  return this.areaType.sameAs(otherTileArea.areaType) && _hasSamePositions(this.positions, otherTileArea.positions);
};

ConnectableSchema.methods.connectsWith = function(area) {
  return this.areaType.sameAs(area.areaType);
};

/**
 * @returns {Boolean} Returns true if this connectable is restricted to one side of the
 * tile. This may need to be changed in case there are tiles that can connect to a tile adjacent to it
 * in two different paths, e.g. a tile that has a u turn road going back to the same side that it came from.
 */
ConnectableSchema.methods.isCulDeSac = function() {
  return (Positions.toDirections(this.positions).length == 1);
};

var _hasSamePositions = function(positions1, positions2) {
  if (!positions1 || !positions2) {
    return false;
  }

  if (positions1.length != positions2.length) {
    return false;
  }

  return positions1.every(function(position) {
    return positions2.indexOf(position) != -1;
  });
};

ConnectableSchema.methods.getFacingDirections = function() {
  return Positions.toDirections(this.positions);
};

module.exports = mongoose.model('ConnectableArea', ConnectableSchema);