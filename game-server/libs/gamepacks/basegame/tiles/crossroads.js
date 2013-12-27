var Tile = require("../../../models/tile");
var Grass = require("../tile-components/grass");
var Road = require("../tile-components/road");

/**
 *  A crossroads tile.
 *  Roads enter from all directions, but break in the center.
 */
var constructions = [
  {
    positions : [ 0,11 ],
    constructionType      : Grass
  },
  {
    positions : [ 1 ],
    constructionType      : Road
  },
  {
    positions : [ 2,3 ],
    constructionType      : Grass
  },
  {
    positions : [ 4 ],
    constructionType      : Road
  },
  {
    positions : [ 5,6 ],
    constructionType      : Grass
  },
  {
    positions : [ 7 ],
    constructionType      : Road
  },
  {
    positions : [ 8,9 ],
    constructionType      : Grass
  },
  {
    positions : [ 10 ],
    constructionType      : Road
  }
];

var tile = new Tile({ "name" : "Crossroads" });
tile.constructions = constructions;
module.exports = tile;