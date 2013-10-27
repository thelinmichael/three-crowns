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

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS  : 0,
  ROAD   : 1,
  CASTLE : 2
};