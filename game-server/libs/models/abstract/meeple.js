var mongoose = require("mongoose");

/**
 * This is a base class for all meeples, e.g. the regular meeple, the big meeple,
 * the mayor, etc.
 */
var MeepleSchema = mongoose.Schema({
  strength :  Number,
  owner : {}
});

module.exports.schema = MeepleSchema;