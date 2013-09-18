var mongoose = require("mongoose");
var schema = mongoose.Schema({
	"id" : String,
	"humanReadableId" : String,
	"expansion" : String
});

module.exports = mongoose.model('Tile', schema);