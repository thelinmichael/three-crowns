var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Road = require("../tile-area-types/road");
var Castle = require("../tile-area-types/castle");

/**
 * Castle that takes up a half circle, and a road that passes outside it.
 * Rule book letter: D.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,8 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 1,7 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 2,3,4,5,6 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 9,10,11 ],
      "areaType" : Castle
    })
  ]
};

var HalfCircleCastleAndRoadTile = mongoose.model('HalfCircleCastleAndRoadTile', BaseSchema);
module.exports = new HalfCircleCastleAndRoadTile({ "name" : "Halfcircle castle and north south road", "areas" : areas });