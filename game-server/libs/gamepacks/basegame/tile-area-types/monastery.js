var BaseSchema = require("../../../models/abstract/tile-area-type.js").schema;
var mongoose = require("mongoose");

/**
* The tiles involved is irrelevant, simply return
* nine points.
*/
BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  return {
    points : 9
  };
};

/**
* Get the number of tiles adjacent to this one
* from the board and return a number of points
* equalling that.
*/
BaseSchema.methods.onGameFinish = function(position, board) {
  return {
    points : 1 + board.getAdjacentTiles(position).length
  };
};

/**
* Building is completed when all adjacent tiles
* have been placed.
*/
BaseSchema.methods.isBuildingCompleted = function(position, board) {
  return (board.getAdjacentTiles(position).length === 8);
};


var Monastery = mongoose.model('Monastery', BaseSchema);

module.exports = new Monastery({ "name" : "Monastery" });