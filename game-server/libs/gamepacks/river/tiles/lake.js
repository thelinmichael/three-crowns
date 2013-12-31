var mongoose = require("mongoose");
var RiverSchema = require("./abstract/rivertile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var River = require("../tile-area-types/river");
var Grass = require("../../basegame/tile-area-types/grass");

/**
 *  The Lake tile, where the River expansion river ends.
 */
var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,5,6,7,8,9,10,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4 ],
      "areaType" : River
    })
  ]
};

var LakeTile = mongoose.model('LakeTile', RiverSchema);
module.exports = new LakeTile({"name" : "Lake", "areas" : areas });