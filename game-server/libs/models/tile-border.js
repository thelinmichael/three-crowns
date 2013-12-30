var mongoose = require("mongoose");

/**
 *  Describes a tile border type, e.g. grass, road,
 *  castle, river.
 *  @param {Boolean} meeplePlaceable Determines if a Meeple can be placed on this type of construction
 *  (e.g. grass, road), versus river on which meeples cannot be placed.
 */
var schema = mongoose.Schema({
  name : { "type" : String },
  meeplePlaceable : { "type" : Boolean, "default" : true }
});

/*
 * @returns {Boolean} Returns true if meeples can be placed on this construction type,
 * otherwise false.
 */
schema.methods.meeplesCanBePlaced = function() {
  return this.meeplePlaceable;
};

module.exports.schema = schema;