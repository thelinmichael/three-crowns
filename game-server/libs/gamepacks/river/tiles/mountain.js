var mongoose = require("mongoose");
var RiverSchema = require("./rivertile").schema;
var River = require("../tile-components/river");
var Grass = require("../../basegame/tile-components/grass");

/* This is a starting tile (priority >= 2), but has the highest priority in the river expansion,
 * and will thus be shuffled before any other tile. */
var priority = 4;

/**
 *  The Mountain tile, where the River expansion river starts.
 */
var borders = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,11 ],
    type : Grass
  },
  {
    positions : [ 10 ],
    type : River
  }
];

var MountainTile = mongoose.model('MountainTile', RiverSchema);
module.exports = new MountainTile({ "priority" : priority, "name" : "Mountain", "borders" : borders });