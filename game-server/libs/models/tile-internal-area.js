var mongoose = require("mongoose");

var InternalSchema = mongoose.Schema({
  areaType : {}
});

/* Since the first release only will include the basegame and the Inns & Cathedrals expansion,
 * there are no internal areas except monasteries. Therefore, knowing that an internal area
 * is finished is the same as knowing if a monastery is finished. This logic can be moved out to the
 * respective areaTypes later on. */
InternalSchema.methods.isFinished = function(x, y, board) {
  return board.coordinateIsSurrounded(x, y);
};

InternalSchema.methods.getType = function() {
  return this.areaType;
};

InternalSchema.methods.matchingProperties = function(otherTileArea) {
  return this.areaType.sameAs(otherTileArea.areaType);
};

module.exports = mongoose.model('InternalArea', InternalSchema);