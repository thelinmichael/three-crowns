var Tile = require("../../../models/tile");
var River = require("../../basegame/tile-components/road");
var Grass = require("../../basegame/tile-components/grass");

/* This is a starting tile (priority > 2), but has the highest priority in the river expansion,
 * and will thus be shuffled before any other tile. */
var priority = 4;

/**
 *  The Mountain tile, where the River expansion river starts.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,11 ],
    constructionType : Grass
  },
  {
    positions : [ 10 ],
    constructionType : River
  }
];

var tile = new Tile({ "priority" : priority, "name" : "Mountain" });
tile.constructions = constructions;
module.exports = tile;