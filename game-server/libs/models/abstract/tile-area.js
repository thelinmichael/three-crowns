var mongoose = require("mongoose");

/**
 *  Describes a tile area.
 */
var TileAreaSchema = mongoose.Schema({
  name : { type : String }
});

module.exports.schema = TileAreaSchema;