var mongoose = require("mongoose");
var RiverSchema = require("./abstract/rivertile").schema;
var River = require("../tile-area-types/river");
var Grass = require("../../basegame/tile-area-types/grass");
var Connectable = require("../../../models/tile-connectable-area");

/**
 *  West east river.
 */
var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,5,6,7,8,9,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4,10 ],
      "areaType" : River
    })
  ]
};

var WestEastRiverTile = mongoose.model('WestEastRiverTile', RiverSchema);
module.exports = new WestEastRiverTile({ "name" : "WestEast river", "areas" : areas });