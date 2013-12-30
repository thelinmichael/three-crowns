var mongoose = require("mongoose");

/**
 *  Describes an internal construction, e.g. monastery.
 */
var TileInternalSchema = mongoose.Schema({
  name : { type : String }
});

module.exports.schema = TileInternalSchema;