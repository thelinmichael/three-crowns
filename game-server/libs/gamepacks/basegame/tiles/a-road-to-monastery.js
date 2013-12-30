var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Monastery = require("../tile-components/monastery");
var Road = require("../tile-components/road");

/**
 * A monastery that is surround by Grass.
 * Rule book letter: A.
 */

var borders = [
  {
    positions : [ 0,1,2,3,4,5,6,8,9,10,11 ],
    type : Grass
  },
  {
    positions : [ 7 ],
    type : Road
  }
];

var internals = [
  Monastery
];

var RoadToMonasteryTile = mongoose.model('RoadToMonasteryTile', BaseSchema);
module.exports = new RoadToMonasteryTile({ "name" : "Road to monastery", "borders" : borders, "internals" : internals });