var mongoose = require("mongoose");

/**
 *  Describes an internal construction, e.g. cloister or
 *  a tower.
 */
var TileInternalConstructionSchema = mongoose.Schema({
  name : { type : String }
});

module.exports.schema = TileInternalConstructionSchema;