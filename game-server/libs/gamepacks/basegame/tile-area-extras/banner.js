var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile-area-extra.js").schema;

BaseSchema.methods.onBuildingComplete = function(tilesInvolved) {
  throw new Error("Not implemented!");
};

BaseSchema.methods.onGameFinish = function(position, board) {
  throw new Error("Not implemented!");
};


BaseSchema.methods.isBuildingCompleted = function(position, board) {
  throw new Error("Not implemented!");
};

module.exports = mongoose.model('Banner', BaseSchema);