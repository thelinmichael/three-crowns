var mongoose = require("mongoose");

/**
 * This model describes a strategy to shuffle the deck before the game is starting.
 * The purpose of having this as a separate module is to be able to insert a
 * different strategy that makes testing easier (e.g. doesn't shuffle).
 */
var schema = mongoose.Schema({
  name : { "type" : String, "default" : "DefaultDeckShufflingStrategy" }
});

/**
 * @params {Array} tiles Tiles that will be shuffled.
 * @returns {Array} Returns an array of tiles placed in order of priority,
 * and random if priority is equal between several tiles.
 */
schema.statics.shuffle = function(tiles) {
  return tiles;
};

module.exports = mongoose.model('DrawpileShufflingStrategy', schema);
module.exports.schema = schema;