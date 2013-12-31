var mongoose = require("mongoose");

/**
 *  Describes a tile area.
 */
var TileAreaSchema = mongoose.Schema({
  name : { type : String },
  connectable : { type : Boolean }
});

module.exports.schema = TileAreaSchema;