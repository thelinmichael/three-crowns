var mongoose = require("mongoose");
var RiverSchema = require("./abstract/rivertile").schema;
var River = require("../tile-area-types/river");
var Grass = require("../../basegame/tile-area-types/grass");
var Connectable = require("../../../models/tile-connectable-area");

/**
 *  The Mountain tile, where the River expansion river starts.
 */
var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,5,6,7,8,9,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 10 ],
      "areaType" : River
    })
  ]
};

var MountainTile = mongoose.model('MountainTile', RiverSchema);
module.exports = new MountainTile({ "name" : "Mountain", "areas" : areas });