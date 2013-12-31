var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");

/**
 * Road enter from the west and continue east.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4,10 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 5,6,7,8,9 ],
      "areaType" : Grass
    })
  ]
};

var StraightRoadTile = mongoose.model('StraightRoadTile', BaseSchema);
module.exports = new StraightRoadTile({ "name" : "Straight road", "areas" : areas });