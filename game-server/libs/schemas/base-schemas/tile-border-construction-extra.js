var mongoose = require("mongoose");

/**
 *  Describes something that gives extra feature to a tile border construction, e.g.
 *  a Penant (the extra) to a Castle (the tile border construction), or an Inn to a Road.
 */
var schema = mongoose.Schema({
  name : { type : String }
});

module.exports = schema;