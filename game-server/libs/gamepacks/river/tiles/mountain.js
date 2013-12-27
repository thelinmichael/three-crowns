var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var River = require("../../basegame/tile-components/road");
var Grass = require("../../basegame/tile-components/grass");

/* This is a starting tile (priority > 2), but has the highest priority in the river expansion,
 * and will thus be shuffled before any other tile. */
var priority = 4;

/**
 *  The Mountain tile, where the River expansion river starts.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,11 ],
    constructionType : Grass
  },
  {
    positions : [ 10 ],
    constructionType : River
  }
];

BaseSchema.methods.canBePlacedAt = function(x, y, board) {
  return this.adjacentTilesBordersMatch(x, y, board) && this.isConnectedToOtherRiver(x, y, board);
};

BaseSchema.methods.isConnectedToOtherRiver = function(x, y, board) {
  return true;
};

var MountainTile = mongoose.model('MountainTile', BaseSchema);
module.exports = new MountainTile({ "priority" : priority, "name" : "Mountain", "constructions" : constructions });