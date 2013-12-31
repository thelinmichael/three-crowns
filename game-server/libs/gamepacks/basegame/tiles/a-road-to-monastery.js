var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Internal = require("../../../models/tile-internal-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");
var Monastery = require("../tile-area-types/monastery");

/**
 * A monastery that is surround by Grass.
 * Rule book letter: A.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,5,6,8,9,10,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 7 ],
      "areaType" : Road
    })
  ],
  "internals" : [
    new Internal({
      "areaType" : Monastery
    })
  ]
};

var RoadToMonasteryTile = mongoose.model('RoadToMonasteryTile', BaseSchema);
module.exports = new RoadToMonasteryTile({ "name" : "Road to monastery", "areas" : areas });