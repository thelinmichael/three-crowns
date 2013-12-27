var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var River = require("../tile-components/river");
var Grass = require("../../basegame/tile-components/grass");

/* This is a starting tile, but other tiles in the river expansion have higher priority and will thus
   be shuffle before it. */
var priority = 2;

/**
 *  The Lake tile, where the River expansion river ends.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,5,6,7,8,9,10,11 ],
    constructionType : Grass
  },
  {
    positions : [ 4 ],
    constructionType : River
  }
];

BaseSchema.methods.canBePlacedAt = function(x, y, board) {
  return this.adjacentTilesBordersMatch(x, y, board) && this.isConnectedToOtherRiver(x, y, board);
};

BaseSchema.methods.isConnectedToOtherRiver = function(x, y, board) {
  return true;
}

var LakeTile = mongoose.model('LakeTile', BaseSchema);
module.exports = new LakeTile({ "priority" : priority, "name" : "Lake", "constructions" : constructions });