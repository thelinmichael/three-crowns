var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Grass = require("../tile-area-types/grass");
var Castle = require("../tile-area-types/castle");

/**
 * Castle that takes up a half circle on the northern part of the tile.
 * Rule book letter: E.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,5,6,7,8 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 9,10,11 ],
      "areaType" : Castle
    })
  ]
};

var HalfCircleCastleTile = mongoose.model('HalfCircleCastleTile', BaseSchema);
module.exports = new HalfCircleCastleTile({ "name" : "HalfCircleCastle", "areas" : areas });
