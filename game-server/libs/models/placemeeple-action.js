var mongoose = require("mongoose");

var PlaceMeepleSchema = mongoose.Schema({
  name      : { type : String, default: "PlaceMeeple" },
  performed : { type : Boolean, default: false }
});

PlaceMeepleSchema.methods.perform = function(game, options) {
  if (options.x === undefined ||
      options.y === undefined ||
      options.tilearea === undefined ||
      options.meeple === undefined) {
    throw new Error("Required options not given", options);
  }

  game.board.placeMeeple(options.x, options.y, options.tilearea, options.meeple);
  game.removeMeepleFromActivePlayer(options.meeple);

  this.performed = true;
};

PlaceMeepleSchema.methods.isPerformed = function() {
  return this.performed;
};

module.exports = mongoose.model('PlaceMeepleAction', PlaceMeepleSchema);