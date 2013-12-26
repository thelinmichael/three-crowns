var Tile = require("../../../models/tile");
var Grass = require("./border/grass");
var Road = require("./border/road");
var Castle = require("./border/castle");
var Penant = require("./border-extras/penant");
var Cloister = require("./internal/cloister");

/* Basepack tile settings */
var CROSSROADS = 2;
var NORTHWEST_ROAD = 2;
var DRAGON_CASTLE = 1;
var HALF_CIRCLE_CASTLE = 2;

var Tiles = {

  /**
   *  @returns {Array} Returns an array of {Tile} that represents the tiles that are in this pack.
   */
  getTiles : function() {
    var returnedTiles = [];

    for (i = 0; i < CROSSROADS; i++) {
      returnedTiles.push(TileTypes.crossroads());
    }

    for (i = 0; i < NORTHWEST_ROAD; i++) {
      returnedTiles.push(TileTypes.westNorthRoad());
    }

    for (i = 0; i < DRAGON_CASTLE; i++) {
      returnedTiles.push(TileTypes.dragonCastle());
    }

    for (i = 0; i < HALF_CIRCLE_CASTLE; i++) {
      returnedTiles.push(TileTypes.halfCircleCastle());
    }

    return returnedTiles;
  }

};

var TileTypes = {

  /**
   *  A crossroads tile.
   *  Roads enter from all directions, but break in the center.
   */
  crossroads : function() {
    var constructions = [
      {
        positions : [ 0,11 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 1 ],
        constructionType      : new Road()
      },
      {
        positions : [ 2,3 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 4 ],
        constructionType      : new Road()
      },
      {
        positions : [ 5,6 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 7 ],
        constructionType      : new Road()
      },
      {
        positions : [ 8,9 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 10 ],
        constructionType      : new Road()
      }
    ];

    var tile = new Tile();
    tile.constructions = constructions;
    return tile;
  },

  /**
   * Road enter from the west and continue north.
   */
  westNorthRoad : function() {
    var constructions = [
      {
        positions : [ 0,11 ],
        constructionType : new Grass()
      },
      {
        positions : [ 1,10 ],
        constructionType : new Road()
      },
      {
        positions : [ 2,3,4,5,6,7,8,9 ],
        constructionType : new Grass()
      }
    ];
    var tile = new Tile();
    tile.constructions = constructions;
    return tile;
  },

  /**
   * A Cloister that is surround by new Grass().
   */
  cloisterSurroundByGrass : function() {
    var constructions = [
      {
        positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
        constructionType      : new Grass()
      }
    ];
    var internals = [
      Cloister
    ];

    var tile = new Tile();
    tile.constructions = constructions;
    tile.internals = internals;
    return tile;
  },

  /**
   * A castle that stretches to the north east corner,
   * where it cuts of the Grass into two different fields.
   */
  dragonCastle : function() {
    var constructions = [
      {
        positions : [ 0,1,2 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 3,4,5,6,7,8 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 9,10,11 ],
        constructionType      : new Castle()
      },
    ];
    var tile = new Tile();
    tile.constructions = constructions;
    return tile;
  },

  /**
   * Castle that takes up a half circle.
   */
  halfCircleCastle : function() {
    var constructions = [
      {
        positions : [ 0,1,2,3,4,5,6,7,8 ],
        constructionType      : new Grass()
      },
      {
        positions : [ 9,10,11 ],
        constructionType      : new Castle()
      }
    ];

    var tile = new Tile();
    tile.constructions = constructions;
    return tile;
  }

};

module.exports = Tiles;
module.exports.TileTypes = TileTypes;