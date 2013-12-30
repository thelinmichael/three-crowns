var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 *  A three-way crossroads tile.
 *  Roads enter from the west, east and south, but break in the center.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,11 ],
    constructionType      : Grass
  },
  {
    positions : [ 4 ],
    constructionType      : Road
  },
  {
    positions : [ 5,6 ],
    constructionType      : Grass
  },
  {
    positions : [ 7 ],
    constructionType      : Road
  },
  {
    positions : [ 8,9 ],
    constructionType      : Grass
  },
  {
    positions : [ 10 ],
    constructionType      : Road
  }
];

var ThreeWayCrossroadsTile = mongoose.model('ThreeWayCrossroadsTile', BaseSchema);
module.exports = new ThreeWayCrossroadsTile({ "name" : "Three-way crossroads", "constructions" : constructions });