var BaseSchema = require("../../../schemas/base-schemas/tile-border-construction.js");
var mongoose = require("mongoose");

/**
 * Nothing should happen when a river is completed.
 * @returns {Object} Returns an object containing the points given
 */
BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  throw new Error("Not implemented!");
};

/**
* Nothing will happen with the river when the game is completed.
*/
BaseSchema.methods.onGameFinish = function(position, board) {
  throw new Error("Not implemented!");
};

/**
* Nothing will happen when the river is completed.
* @returns {Boolean} True if building is completed, otherwise false
*/
BaseSchema.methods.isBuildingCompleted = function(position, board) {
  throw new Error("Not implemented!");
};

/**
 * Rivers only match other rivers.
 * @param {TileBorderConstruction} constructionType
 * @returns {Boolean} Returns true if this type of tile matches {ConstructionType}.
 */
BaseSchema.methods.matches = function(constructionType) {
  return (constructionType.getName() === "River");
};

BaseSchema.methods.getName = function() {
  return this.name;
};

var River = mongoose.model('River', BaseSchema);

module.exports = new River({ "name" : "River", "meeplePlaceable" : false });