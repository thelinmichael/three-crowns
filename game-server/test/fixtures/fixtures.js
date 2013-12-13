var Tile = require("../../libs/models/tile");

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

module.exports = exports;