var Tile = require("../../../models/tile");
var Grass = require("../tile-components/grass");
var Castle = require("../tile-components/castle");


/**
 * A castle that stretches to the north east corner,
 * where it cuts of the Grass into two different fields.
 */
var constructions = [
  {
    positions : [ 0,1,2 ],
    constructionType      : Grass
  },
  {
    positions : [ 3,4,5,6,7,8 ],
    constructionType      : Grass
  },
  {
    positions : [ 9,10,11 ],
    constructionType      : Castle
  },
];

var tile = new Tile({ "name" : "Dragoncastle" });
tile.constructions = constructions;
module.exports = tile;