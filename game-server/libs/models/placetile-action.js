var mongoose = require("mongoose");

var PlaceMeeple = require("./placemeeple-action");

var PlaceTileSchema = mongoose.Schema({
  name      : { type : String, default: "PlaceTile" },
  performed : { type : Boolean, default: false }
});

PlaceTileSchema.methods.perform = function(game, options) {
  if (options.x === undefined ||
      options.y === undefined ||
      options.tile === undefined ||
      options.rotation === undefined) {
    throw new Error("Required options not given", options);
  }

  game.board.placeTile(options.x, options.y, options.tile, options.rotation);
  game.returnMeeplesFromFinishedAreas();
  game.giveOptionalAction(new PlaceMeeple());

  this.performed = true;
};

PlaceTileSchema.methods.isPerformed = function() {
  return this.performed;
};

module.exports = mongoose.model('PlaceTileAction', PlaceTileSchema);