var BaseSchema = require("../../../models/abstract/tile-area.js").schema;
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
  return (constructionType.getName() === "Road");
};

BaseSchema.methods.getName = function() {
  return this.name;
};

var Road = mongoose.model('Road', BaseSchema);

module.exports = new Road({ "name" : "Road" });