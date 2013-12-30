var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 *  A three-way crossroads tile.
 *  Roads enter from the west, east and south, but break in the center.
 *  Rule book letter: W.
 */
var borders = [
  {
    positions : [ 0,1,2,3,11 ],
    type      : Grass
  },
  {
    positions : [ 4 ],
    type      : Road
  },
  {
    positions : [ 5,6 ],
    type      : Grass
  },
  {
    positions : [ 7 ],
    type      : Road
  },
  {
    positions : [ 8,9 ],
    type      : Grass
  },
  {
    positions : [ 10 ],
    type      : Road
  }
];

var ThreeWayCrossroadsTile = mongoose.model('ThreeWayCrossroadsTile', BaseSchema);
module.exports = new ThreeWayCrossroadsTile({ "name" : "Three-way crossroads", "borders" : borders });