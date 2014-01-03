var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");

/**
 * Road enter from the south and continue west.
 * Rule book letter: V.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 11,0,1,2,3,4,5,6 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 7,10 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 8,9 ],
      "areaType" : Grass
    })
  ]
};

var CurvedRoadTile = mongoose.model('CurvedRoadTile', BaseSchema);
module.exports = new CurvedRoadTile({ "name" : "Curved road", "areas" : areas });