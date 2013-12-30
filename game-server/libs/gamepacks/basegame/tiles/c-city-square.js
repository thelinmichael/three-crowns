var mongoose = require("mongoose");
var BaseSchema = require("../../../models/tile").schema;
var Castle = require("../tile-components/castle");
var Banner = require("../tile-components/banner");

/**
 * A city square. Castle cover the whole tile.
 * Rule book letter: C.
 */

var borders = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
    type      : Castle,
    extras    : Banner
  }
];

var CitySquareTile = mongoose.model('citySquareTile', BaseSchema);
module.exports = new CitySquareTile({ "name" : "City square", "borders" : borders });