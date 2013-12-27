var BaseSchema = require("../../../schemas/base-schemas/meeple.js");
var mongoose = require("mongoose");

/**
 * @params {TileConstructionType} constructionType The type of construction that
 * this meeple may be placed on.
 * @returns (Boolean) Returns true if this meeple can be placed on {constructionType},
 * otherwise false. Since regular meeples can be placed on anything, this function
 * always returns true.
 */
 BaseSchema.methods.canBePlacedOn = function(constructionType) {
  return true;
 };

var RegularMeeple = mongoose.model('RegularMeeple', BaseSchema);

module.exports = new RegularMeeple();