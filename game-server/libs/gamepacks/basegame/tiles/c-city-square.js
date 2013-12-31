var mongoose = require("mongoose");
var BaseSchema = require("../../../models/abstract/tile").schema;
var Connectable = require("../../../models/tile-connectable-area");
var Internal = require("../../../models/tile-internal-area");
var Castle = require("../tile-area-types/castle");
var Banner = require("../tile-area-extras/banner");

/**
 * A city square. Castle cover the whole tile.
 * Rule book letter: C.
 */
 var areas = {
  "connectables" : [
    new Connectable({
      "positions" : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
      "areaType" : Castle,
      "extras" : [ Banner ]
    })
  ]
};

var CitySquareTile = mongoose.model('citySquareTile', BaseSchema);
module.exports = new CitySquareTile({ "name" : "City square", "areas" : areas });