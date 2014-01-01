var mongoose = require("mongoose");

var PlaceTileSchema = mongoose.Schema({
  name      : { type : String, default: "PlaceTile" },
  performed : { type : Boolean, default: false }
});

PlaceTileSchema.methods.perform = function(board, options) {
  if (options.x === undefined ||
      options.y === undefined ||
      options.tile === undefined ||
      options.rotation === undefined) {
    throw new Error("Required options not given", options);
  }

  board.placeTile(options.x, options.y, options.tile, options.rotation);

  this.performed = true;
};

module.exports = mongoose.model('PlaceTileAction', PlaceTileSchema);