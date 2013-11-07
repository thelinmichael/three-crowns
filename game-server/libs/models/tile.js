var mongoose = require("mongoose");
var schema = mongoose.Schema({
  edges : {
    north : Number,
    east  : Number,
    south : Number,
    west  : Number
  }
});

schema.methods.getEdges = function() {
  return this.edges;
}

schema.methods.sameAs = function(otherTile) {
  var edges = otherTile.getEdges();
  for (var i = 0; i < 4; i++) {
    if (edges.north == this.getEdges().north &&
        edges.east  == this.getEdges().east &&
        edges.south == this.getEdges().south &&
        edges.west  == this.getEdges().west) {
      return true;
    } else {
      edges = this.rotatedEdges(edges);
    }
  }
  return false;
}

schema.methods.rotatedEdges = function(edges) {
  var rotated = {
    north : edges.west,
    east : edges.north,
    south : edges.east,
    west : edges.south
  };
  return rotated;
}

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS  : 0,
  ROAD   : 1,
  CASTLE : 2
};