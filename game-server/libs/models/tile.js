var mongoose = require("mongoose");
var schema = mongoose.Schema({
  components : {
    borders : [Number],
    internal  : Number
  }
});

schema.methods.getInternal = function() {
  return this.components.internal;
};

schema.methods.getBorders = function() {
  return this.components.borders;
};

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS  : 0,
  ROAD   : 1,
  CASTLE : 2,
  CATHEDRAL : 3
};