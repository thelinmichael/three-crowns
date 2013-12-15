var Tile = require("../../libs/models/tile");
var Game = require("../../libs/models/game");
var Player = require("../../libs/models/player");

exports.generateTile = function() {
  var borders = [
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,       // North
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,      // East
      Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE,   // South
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS       // West
  ];

  var internal = Tile.EdgeTypes.CATHEDRAL;  // Middle of tile

  return new Tile({ "components" : {
                      "borders" : borders,
                      "internal" : internal
                  }
  });
};

exports.generateCrossroadsTile = function() {
  var borders = [
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS
  ];

  return new Tile({ "components" : {
                      "borders" : borders
                  }
  });
};

exports.generateWestNorthCorner = function() {
  var borders = [
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,
    Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS
  ];
  return new Tile({ "components" : {
                      "borders" : borders
                  }
  });
};

exports.generateGenericGame = function() {
    var player1 = new Player({ name : "Michael" });
    var player2 = new Player({ name : "Jenni"});
    var players = [player1, player2];

    var tile1 = this.generateCrossroadsTile();
    var tile2 = this.generateCrossroadsTile();
    var tile3 = this.generateWestNorthCorner();
    var tile4 = this.generateWestNorthCorner();
    var startingTiles = [tile1, tile2, tile3, tile4];

    return new Game({ "tileQueue" : startingTiles, "players" : players });
};

module.exports = exports;