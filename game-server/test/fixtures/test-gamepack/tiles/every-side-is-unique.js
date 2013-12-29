var mongoose = require("mongoose");
var BaseSchema = require("../../../../libs/models/tile").schema;
var Grass = require("../../../../libs/gamepacks/basegame/tile-components/grass");
var Road = require("../../../../libs/gamepacks/basegame/tile-components/road");
var Castle = require("../../../../libs/gamepacks/basegame/tile-components/castle");
var River = require("../../../../libs/gamepacks/river/tile-components/river");

/**
 * Tile where all sides are different from the others.
 */
var constructions = [
  {
    positions : [ 0 ],
    constructionType : Grass
  },
  {
    positions : [ 1 ],
    constructionType : Road
  },
  {
    positions : [ 2,3,4,5,6 ],
    constructionType : Grass
  },
  {
    positions : [ 7  ],
    constructionType : River
  },
  {
    positions : [ 8 ],
    constructionType : Grass
  },
  {
    positions : [ 9,10,11 ],
    constructionType : Castle
  }
];

var UniqueSidesTile = mongoose.model('UniqueSidesTile', BaseSchema);
module.exports = new UniqueSidesTile({ "name" : "Unique Sides tile", "constructions" : constructions });