var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 * Road enter from the west and continue east.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,11 ],
    constructionType : Grass
  },
  {
    positions : [ 10,4 ],
    constructionType : Road
  },
  {
    positions : [ 4,5,6,7,8,9 ],
    constructionType : Grass
  }
];


var WestEastRoadTile = mongoose.model('WestEastRoadTile', BaseSchema);
module.exports = new WestEastRoadTile({ "name" : "West to east road", "constructions" : constructions });