var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");

/**
 *  A crossroads tile.
 *  Roads enter from all directions, but break in the center.
 */
  var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 1 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 2,3 ],
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
    })
  ]
};

var CrossroadsTile = mongoose.model('CrossroadsTile', BaseSchema);
module.exports = new CrossroadsTile({ "name" : "Crossroads", "areas" : areas });