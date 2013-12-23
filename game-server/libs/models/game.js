var mongoose = require("mongoose");
var GameSchema = require("../schemas/game");

module.exports = mongoose.model('Game', GameSchema);