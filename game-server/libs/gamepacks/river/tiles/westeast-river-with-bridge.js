var mongoose = require("mongoose");
var RiverSchema = require("./rivertile").schema;
var River = require("../tile-components/river");
var Grass = require("../../basegame/tile-components/grass");
var Road = require("../../basegame/tile-components/road");

var priority = 3;

/**
 *  A river that flows from west to east, or the other way around. It dun' matter.
 */
var borders = [
  {
    positions : [ 0,11 ],
    type : Grass
  },
  {
    positions : [ 1,7 ],
    type : Road
  },
  {
    positions : [ 2,3 ],
    type : Grass
  },
  {
    positions : [ 4,10 ],
    type : River
  },
  {
    positions : [ 5,6 ],
    type : Grass
  },
  {
    positions : [ 8,9 ],
    type : Grass
  }
];

var WestEastRiverWithBridgeTile = mongoose.model('WestEastRiverWithBridgeTile', RiverSchema);
module.exports = new WestEastRiverWithBridgeTile({ "priority" : priority, "name" : "WestEastRiver With Bridge", "borders" : borders });