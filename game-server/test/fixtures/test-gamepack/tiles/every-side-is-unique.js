var mongoose = require("mongoose");
var BaseSchema = require("../../../../libs/models/tile").schema;
var Grass = require("../../../../libs/gamepacks/basegame/tile-components/grass");
var Road = require("../../../../libs/gamepacks/basegame/tile-components/road");
var Castle = require("../../../../libs/gamepacks/basegame/tile-components/castle");
var River = require("../../../../libs/gamepacks/river/tile-components/river");

/**
 * Tile where all sides are different from the others.
 */
var borders = [
  {
    positions : [ 0 ],
    type : Grass
  },
  {
    positions : [ 1 ],
    type : Road
  },
  {
    positions : [ 2,3,4,5,6 ],
    type : Grass
  },
  {
    positions : [ 7  ],
    type : River
  },
  {
    positions : [ 8 ],
    type : Grass
  },
  {
    positions : [ 9,10,11 ],
    type : Castle
  }
];

var UniqueSidesTile = mongoose.model('UniqueSidesTile', BaseSchema);
module.exports = new UniqueSidesTile({ "name" : "Unique Sides tile", "borders" : borders });