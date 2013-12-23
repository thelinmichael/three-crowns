var mongoose = require("mongoose");

/**
 *  Describes a tile border type, e.g. grass, road,
 *  castle and abbey.
 */
var schema = mongoose.Schema({
  name : { type : String },
  extensions : {}
});

module.exports = mongoose.model('BorderConstruction', schema);