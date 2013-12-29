var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");
var Castle = require("../tile-components/castle");

/**
 * Castle that takes up a half circle.
 */
var constructions = [
  {
    positions : [ 0,8 ],
    constructionType      : Grass
  },
  {
    positions : [ 1,7 ],
    constructionType : Road
  },
  {
    positions : [ 2,3,4,5,6 ],
    constructionType : Grass
  },
  {
    positions : [ 9,10,11 ],
    constructionType      : Castle
  }
];

var HalfCircleCastleWithRoadTile = mongoose.model('HalfCircleCastleWithRoadTile', BaseSchema);
module.exports = new HalfCircleCastleWithRoadTile({ "name" : "Halfcircle castle with north south road", "constructions" : constructions });