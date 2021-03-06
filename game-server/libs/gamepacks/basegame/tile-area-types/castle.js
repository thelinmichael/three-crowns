var BaseSchema = require("../../../models/abstract/tile-area-type.js").schema;
var mongoose = require("mongoose");

/**
 * This function is run when a building of this type is completed.
 * @returns {Object} Returns an object containing the points given
 */
BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  throw new Error("Not implemented!");
};

/**
* Get the number of tiles adjacent to this one
* from the board and return a number of points
* equalling that.
*/
BaseSchema.methods.onGameFinish = function(position, board) {
  throw new Error("Not implemented!");
};

/**
* @returns {Boolean} True if building is completed, otherwise false
*/
BaseSchema.methods.isBuildingCompleted = function(position, board) {
  throw new Error("Not implemented!");
};

BaseSchema.methods.matches = function(constructionType) {
  return (constructionType.getName() === "Castle");
};

BaseSchema.methods.getName = function() {
  return this.name;
};

/* TODO: Implement */
BaseSchema.methods.getScore = function(board, areasInvolved) {
  return 0;
};

var Castle = mongoose.model('Castle', BaseSchema);

module.exports = new Castle({ "name" : "Castle" });