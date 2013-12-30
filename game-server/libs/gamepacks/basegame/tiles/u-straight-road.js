var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 * Road enter from the west and continue north.
 */
var borders = [
  {
    positions : [ 0,11 ],
    type : Grass
  },
  {
    positions : [ 1,10 ],
    type : Road
  },
  {
    positions : [ 2,3,4,5,6,7,8,9 ],
    type : Grass
  }
];

var StraightRoadTile = mongoose.model('StraightRoadTile', BaseSchema);
module.exports = new StraightRoadTile({ "name" : "Straight road", "borders" : borders });