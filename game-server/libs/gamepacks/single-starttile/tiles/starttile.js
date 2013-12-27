var Tile = require("../../../models/tile");
var Grass = require("../tile-components/grass");
var Castle = require("../tile-components/castle");
var Road = require("../tile-components/road");

/**
 * The basepacks starting tile. A half circle castle, with a road
 * spanning from west to east.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,11 ],
    constructionType : Grass
  },
  {
    positions : [ 4,10 ],
    constructionType : Road
  },
  {
    positions : [ 5,9 ],
    constructionType : Grass
  },
  {
    positions : [ 6,7,8 ],
    constructionType : Castle
  }
];

var tile = new Tile();
tile.constructions = constructions;
module.exports = tile;