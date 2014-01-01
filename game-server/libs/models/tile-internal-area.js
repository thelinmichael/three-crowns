var mongoose = require("mongoose");

var InternalSchema = mongoose.Schema({
  areaType : {}
});

InternalSchema.methods.getType = function() {
  return this.areaType;
};

InternalSchema.methods.matchingProperties = function(otherTileArea) {
  return this.areaType.sameAs(otherTileArea.areaType);
};

module.exports = mongoose.model('InternalArea', InternalSchema);