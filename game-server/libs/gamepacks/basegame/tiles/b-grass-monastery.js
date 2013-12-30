var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Monastery = require("../tile-components/monastery");

/**
 * A monastery surrounded by Grass.
 * Rule book letter: B.
 */

var borders = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
    type : Grass
  }
];

var internals = [
  Monastery
];

var GrassMonasteryTile = mongoose.model('GrassMonasteryTile', BaseSchema);
module.exports = new GrassMonasteryTile({ "name" : "GrassMonastery", "borders" : borders, "internals" : internals });