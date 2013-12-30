var mongoose = require("mongoose");
var RiverSchema = require("./rivertile").schema;
var River = require("../tile-components/river");
var Grass = require("../../basegame/tile-components/grass");

var priority = 3;

/**
 *  A river that flows from west to east, or the other way around. It dun' matter.
 */
var borders = [
  {
    positions : [ 0,1,2,3,5,6,7,8,9,11 ],
    type : Grass
  },
  {
    positions : [ 4,10 ],
    type : River
  }
];

var WestEastRiverTile = mongoose.model('WestEastRiver', RiverSchema);
module.exports = new WestEastRiverTile({ "priority" : priority, "name" : "WestEast River", "borders" : borders });