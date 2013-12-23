var mongoose = require("mongoose");

/**
 *  Describes an internal construction, e.g. cloister or
 *  a tower.
 */
var schema = mongoose.Schema({
  name : { type : String },
  extensions : {}
});

module.exports = mongoose.model('InternalConstruction', schema);