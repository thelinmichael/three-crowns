var mongoose = require("mongoose");

var schema = mongoose.Schema({
  name: String
});
var Player = mongoose.model('Player', schema);

exports.Player = Player;
