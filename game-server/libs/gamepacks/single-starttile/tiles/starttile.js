var mongoose = require("mongoose");

var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../../basegame/tile-components/grass");
var Castle = require("../../basegame/tile-components/castle");
var Road = require("../../basegame/tile-components/road");

/**
 * The basepacks starting tile. A half circle castle, with a road
 * spanning from north to south.
 * Rule book letter: D.
 */

var priority = 2;

var borders = [
  {
    positions : [ 0,1,2,3,4,11 ],
    type : Grass
  },
  {
    positions : [ 4,10 ],
    type : Road
  },
  {
    positions : [ 5,9 ],
    type : Grass
  },
  {
    positions : [ 6,7,8 ],
    type : Castle
  }
];


var StartTile = mongoose.model('StartTile', BaseSchema);
module.exports = new StartTile({ "name" : "Single start tile", "borders" : borders, "priority" : priority });