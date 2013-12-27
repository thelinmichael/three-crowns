var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Cloister = require("../tile-components/cloister");

/**
 * A Cloister that is surround by Grass.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
    constructionType : Grass
  }
];

var internals = [
  Cloister
];

var GrassCloisterTile = mongoose.model('GrassCloisterTile', BaseSchema);
module.exports = new GrassCloisterTile({ "name" : "GrassCloister", "constructions" : constructions, "internals" : internals });