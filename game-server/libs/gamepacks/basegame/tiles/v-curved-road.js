var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 * Road enter from the south and continue west.
 * Rule book letter: V.
 */
var borders = [
  {
    positions : [ 0,1,2,3,11 ],
    type : Grass
  },
  {
    positions : [ 10,4 ],
    type : Road
  },
  {
    positions : [ 4,5,6,7,8,9 ],
    type : Grass
  }
];

var CurvedRoadTile = mongoose.model('CurvedRoadTile', BaseSchema);
module.exports = new CurvedRoadTile({ "name" : "Curved road", "borders" : borders });