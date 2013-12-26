var Tile = require("../../../models/tile");
var Grass = require("../tile-components/grass");
var Castle = require("../tile-components/castle");


/**
 * Castle that takes up a half circle.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8 ],
    constructionType      : Grass
  },
  {
    positions : [ 9,10,11 ],
    constructionType      : Castle
  }
];

var tile = new Tile();
tile.constructions = constructions;
module.exports = tile;