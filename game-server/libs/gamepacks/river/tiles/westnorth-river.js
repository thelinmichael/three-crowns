var Tile = require("../../../models/tile");
var River = require("../tile-components/road");
var Grass = require("../../basegame/tile-components/grass");

/**
 *  A river that flows from west to east, or the other way around. It dun' matter.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,5,6,7,8,9,11 ],
    constructionType : Grass
  },
  {
    positions : [ 4,10 ],
    constructionType : River
  }
];

var tile = new Tile();
tile.constructions = constructions;
module.exports = tile;