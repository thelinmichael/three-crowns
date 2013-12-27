var Tile = require("../../../models/tile");
var River = require("../../basegame/tile-components/road");
var Grass = require("../../basegame/tile-components/grass");

/* This is a starting tile, but other tiles in the river expansion have higher priority and will thus
   be shuffle before it. */
var priority = 2;

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

var tile = new Tile({ "priority" : priority, "name" : "Lake" });
tile.constructions = constructions;
module.exports = tile;