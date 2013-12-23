var BaseSchema = require("../../../../schemas/tile-border-construction-extra.js");
var mongoose = require("mongoose");

/**
 * Return one point when castle has finished and there's a penant.
 */
BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  return {
    points : 1
  };
};

/**
* Get the number of tiles adjacent to this one
* from the board and return a number of points
* equalling that.
*/
BaseSchema.methods.onGameFinish = function(position, board) {
  return {
    points : 1
  };
};

/**
* @returns {Boolean} True if building is completed, otherwise false
*/
BaseSchema.methods.isBuildingCompleted = function(position, board) {
  throw new Error("Not implemented!");
};

module.exports = mongoose.model('Penant', BaseSchema);