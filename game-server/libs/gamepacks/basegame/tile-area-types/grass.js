var BaseSchema = require("../../../models/abstract/tile-area-type.js").schema;
var mongoose = require("mongoose");

/**
 * This function is run when a building of this type is completed.
 * @returns {Object} Returns an object containing the points given
 */
BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  throw new Error("Not implemented!");
};

BaseSchema.methods.onGameFinish = function(position, board) {
  throw new Error("Not implemented!");
};

/**
* @returns {Boolean} True if building is completed, otherwise false
*/
BaseSchema.methods.isBuildingCompleted = function(position, board) {
  throw new Error("Not implemented!");
};

BaseSchema.methods.matches = function(areaType) {
  return (areaType.getName() === "Grass");
};

BaseSchema.methods.getName = function() {
  return this.name;
};

var Grass = mongoose.model('Grass', BaseSchema);

module.exports = new Grass({ "name" : "Grass" });