var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Castle = require("../tile-components/castle");

/**
 * Castle that takes up a half circle.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8 ],
    constructionType      : Grass
  },
  {
    positions : [ 9,10,11 ],
    constructionType      : Castle
  }
];

var HalfCircleCastleTile = mongoose.model('HalfCircleCastleTile', BaseSchema);
module.exports = new HalfCircleCastleTile({ "name" : "HalfCircleCastle", "constructions" : constructions });