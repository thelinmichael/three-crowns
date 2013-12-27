var Tile = require("../../../models/tile");
var River = require("../tile-components/road");
var Grass = require("../../basegame/tile-components/grass");

/**
 *  The Lake tile, where the River expansion river ends.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,5,6,7,8,9,10,11 ],
    constructionType : Grass
  },
  {
    positions : [ 4 ],
    constructionType : River
  }
];

var tile = new Tile();
tile.constructions = constructions;
module.exports = tile;