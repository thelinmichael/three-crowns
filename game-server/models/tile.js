var mongoose = require("mongoose");

var schema = mongoose.schema({
  "start" : Date,
  "id" : String,
  "humanReadableId" : String,
  "expansion" : String
});
var Tile = mongoose.model('Tile', schema);

exports.Tile = Tile;