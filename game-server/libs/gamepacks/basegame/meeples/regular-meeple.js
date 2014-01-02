var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/meeple.js").schema;

 BaseSchema.methods.canBePlacedOn = function(constructionType) {
  return true;
 };

var RegularMeeple = mongoose.model('RegularMeeple', BaseSchema);
module.exports = RegularMeeple;