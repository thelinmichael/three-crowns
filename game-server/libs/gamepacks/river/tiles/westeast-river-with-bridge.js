var mongoose = require("mongoose");
var RiverSchema = require("./abstract/rivertile").schema;
var River = require("../tile-area-types/river");
var Grass = require("../../basegame/tile-area-types/grass");
var Road = require("../../basegame/tile-area-types/road");
var Connectable = require("../../../models/tile-connectable-area");

/**
 *  West east river with bridge over it.
 */
var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 1,7 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 2,3 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4,10 ],
      "areaType" : River
    }),
    new Connectable({
      "positions" : [ 5,6 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 8,9 ],
      "areaType" : Grass
    })
  ]
};

var WestEastRiverWithBridgeTile = mongoose.model('WestEastRiverWithBridgeTile', RiverSchema);
module.exports = new WestEastRiverWithBridgeTile({ "name" : "WestEastRiver With Bridge", "areas" : areas });