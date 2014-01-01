var mongoose = require("mongoose");

var PlaceMeepleSchema = mongoose.Schema({
  name      : { type : String, default: "PlaceMeeple" },
  performed : { type : Boolean, default: false }
});

PlaceMeepleSchema.methods.perform = function(board, options) {
  if (options.x === undefined ||
      options.y === undefined ||
      options.tilearea === undefined ||
      options.meeple === undefined) {
    throw new Error("Required options not given", options);
  }

  board.placeMeeple(options.x, options.y, options.tilearea, options.meeple);

  this.performed = true;
};

module.exports = mongoose.model('PlaceMeepleAction', PlaceMeepleSchema);