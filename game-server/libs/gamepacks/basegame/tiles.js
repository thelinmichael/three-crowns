var Tile = require("../../libs/models/tile");
var TileFeatures = require("tilefeatures.js");
var ConstructionTypes = TileFeatures.ConstructionTypes;
var SpecialFeatureTypes = TileFeatures.SpecialFeatureTypes;
var InternalTypes = TileFeatures.InternalTypes;

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

    for (var i = 0; i < CROSSROADS; i++) {
      returnedTiles.push(_TileTypes.crossroads());
    }

    for (var i = 0; i < NORTHWEST_ROAD; i++) {
      returnedTiles.push(_TileTypes.westNorthRoad());
    }

    for (var i = 0; i < DRAGON_CASTLE; i++) {
      returnedTiles.push(_TileTypes.dragonCastle());
    }

    for (var i = 0; i < HALF_CIRCLE_CASTLE; i++) {
      returnedTiles.push(_TileTypes.halfCircleCastle());
    }

  }

};

var _TileTypes = {

  /**
   *  A crossroads tile.
   *  Roads enter from all directions, but break in the center.
   */
  crossroads : function() {
    var constructions = [
      {
        positions : [ 0,11 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 1 ],
        type      : ConstructionTypes.ROAD
      },
      {
        positions : [ 2,3 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 4 ],
        type      : ConstructionTypes.ROAD
      },
      {
        positions : [ 5,6 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 7 ],
        type      : ConstructionTypes.ROAD
      },
      {
        positions : [ 8,9 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 10 ],
        type      : ConstructionTypes.ROAD
      }
    ];

    return new Tile(constructions);
  },

  /**
   * Road enter from the west and continue north.
   */
  westNorthRoad : function() {
    var constructions = [
      {
        positions : [ 0,11 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 1,10 ],
        type      : ConstructionTypes.ROAD
      },
      {
        positions : [ 2,3,4,5,6,7,8,9 ],
        type      : ConstructionTypes.GRASS
      }
    ];

    return new Tile(constructions);
  },

  /**
   * A Cloister that is surround by grass.
   */
  cloisterSurroundByGrass : function() {
    var constructions = [
      {
        positions : [ 0,1,2,3,4,5,6,7,8,9,10,11 ],
        type      : ConstructionTypes.GRASS
      }
    ];
    var internals = [
      InternalTypes.CLOISTER
    ];
    return new Tile(constructions, internals);
  },

  /**
   * A castle that stretches to the north east corner,
   * where it cuts of the grass into two different fields.
   */
  dragonCastle : function() {
    var constructions = [
      {
        positions : [ 0,1,2 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 3,4,5,6,7,8 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 9,10,11 ],
        type      : ConstructionTypes.CASTLE
      },
    ];
    return new Tile(constructions);
  },

  /**
   * Castle that takes up a half circle.
   */
  halfCircleCastle : function() {
    var constructions = [
      {
        positions : [ 0,1,2,3,4,5,6,7,8 ],
        type      : ConstructionTypes.GRASS
      },
      {
        positions : [ 9,10,11 ],
        type      : ConstructionTypes.CASTLE
      }
    ];

    return new Tile(constructions);
  }

};

exports.Tiles = Tiles;
module.exports = exports;