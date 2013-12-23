var mongoose = require("mongoose");
var TileSchema = require("../schemas/tile");

module.exports = mongoose.model('Tile', TileSchema);