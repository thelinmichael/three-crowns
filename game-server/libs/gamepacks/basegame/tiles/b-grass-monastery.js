var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Internal = require("../../../models/tile-internal-area");
var Grass = require("../tile-area-types/grass");
var Monastery = require("../tile-area-types/monastery");

/**
 * A monastery surrounded by Grass.
 * Rule book letter: B.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
      "areaType" : Grass
    })
  ],
  "internals" : [
    new Internal({
      "areaType" : Monastery
    })
  ]
};

var GrassMonasteryTile = mongoose.model('GrassMonasteryTile', BaseSchema);
module.exports = new GrassMonasteryTile({ "name" : "GrassMonastery", "areas" : areas });