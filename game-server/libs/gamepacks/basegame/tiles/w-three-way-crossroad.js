var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");

/**
 *  A three-way crossroads tile.
 *  Roads enter from the west, east and south, but break in the center.
 *  Rule book letter: W.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 5,6 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 7 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 8,9 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 10 ],
      "areaType" : Road
    }),
  ]
};

var ThreeWayCrossroadsTile = mongoose.model('ThreeWayCrossroadsTile', BaseSchema);
module.exports = new ThreeWayCrossroadsTile({ "name" : "Three-way crossroads", "areas" : areas });