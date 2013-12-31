var mongoose = require("mongoose");

var BaseSchema = require("../../../models/tile").schema;
var Grass = require("../../basegame/tile-area-type/grass");
var Castle = require("../../basegame/tile-area-type/castle");
var Road = require("../../basegame/tile-area-type/road");

/**
 * The basepacks starting tile. A half circle castle, with a road
 * spanning from north to south.
 * Rule book letter: D.
 */
var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,11 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 4,10 ],
      "areaType" : Road
    }),
    new Connectable({
      "positions" : [ 5,9 ],
      "areaType" : Grass
    }),
    new Connectable({
      "positions" : [ 6,7,8 ],
      "areaType" : Castle
    })
  ]
};

var StartTile = mongoose.model('StartTile', BaseSchema);
module.exports = new StartTile({ "name" : "Single start tile", "areas" : areas });