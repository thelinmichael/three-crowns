var Tile = require("../../../models/tile");
var Grass = require("../tile-components/grass");
var Cloister = require("../tile-components/cloister");

/**
 * A Cloister that is surround by Grass.
 */
var constructions = [
  {
    positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
    constructionType : Grass
  }
];

var internals = [
  Cloister
];

var tile = new Tile({ "name" : "Grass cloister" });
tile.constructions = constructions;
tile.internals = internals;
module.exports = tile;