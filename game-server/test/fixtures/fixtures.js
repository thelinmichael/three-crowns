var Tile = require("../../libs/models/tile");
var Game = require("../../libs/models/game");
var Player = require("../../libs/models/player");

var Tiles = {

  crossroads : function() {
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
  },

  westNorthCorner : function() {
    var borders = [
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS
    ];

    var connections = [
      [0,11],
      [1,10],
      [2,3,4,5,6,7,8,9]
    ];

    return new Tile({ "components" : {
                        "borders" : borders
                      },
                      "connections" : connections
                    });
  }

};

var Games = {

  genericGame : function() {
    var player1 = new Player({ name : "Michael" });
    var player2 = new Player({ name : "Jenni"});
    var players = [player1, player2];

    var tile1 = Tiles.crossroads();
    var tile2 = Tiles.crossroads();
    var tile3 = Tiles.westNorthCorner();
    var tile4 = Tiles.westNorthCorner();
    var startingTiles = [tile1, tile2, tile3, tile4];

    return new Game({ "tileQueue" : startingTiles, "players" : players });
  }
};

exports.Tiles = Tiles;
exports.Games = Games;
module.exports = exports;