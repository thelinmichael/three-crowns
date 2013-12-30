var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");
var Castle = require("../tile-components/castle");

/**
 * Castle that takes up a half circle, and a road that passes outside it.
 * Rule book letter: D.
 */
var borders = [
  {
    positions : [ 0,8 ],
    type      : Grass
  },
  {
    positions : [ 1,7 ],
    type : Road
  },
  {
    positions : [ 2,3,4,5,6 ],
    type : Grass
  },
  {
    positions : [ 9,10,11 ],
    type      : Castle
  }
];

var HalfCircleCastleAndRoadTile = mongoose.model('HalfCircleCastleAndRoadTile', BaseSchema);
module.exports = new HalfCircleCastleAndRoadTile({ "name" : "Halfcircle castle and north south road", "borders" : borders });