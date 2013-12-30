var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 *  A crossroads tile.
 *  Roads enter from all directions, but break in the center.
 */
var borders = [
  {
    positions : [ 0,11 ],
    type      : Grass
  },
  {
    positions : [ 1 ],
    type      : Road
  },
  {
    positions : [ 2,3 ],
    type      : Grass
  },
  {
    positions : [ 4 ],
    type      : Road
  },
  {
    positions : [ 5,6 ],
    type      : Grass
  },
  {
    positions : [ 7 ],
    type      : Road
  },
  {
    positions : [ 8,9 ],
    type      : Grass
  },
  {
    positions : [ 10 ],
    type      : Road
  }
];

var CrossroadsTile = mongoose.model('CrossroadsTile', BaseSchema);
module.exports = new CrossroadsTile({ "name" : "Crossroads", "borders" : borders });