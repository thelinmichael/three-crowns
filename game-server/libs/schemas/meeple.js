var mongoose = require('mongoose');

/**
 * This is a base class for all meeples, e.g.
 * the regular meeple, the big meeple, the dragon,
 * the mayor, etc.
 */
var schema = mongoose.Schema({
  strength :  Number
});

module.exports = schema;