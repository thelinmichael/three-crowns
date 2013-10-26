var mongoose = require("mongoose");
var schema = mongoose.Schema({
  edges : []
});

schema.methods.getEdges = function() {
  return this.edges;
}

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS : 0,
  ROAD : 1,
  CASTLE : 2
};
