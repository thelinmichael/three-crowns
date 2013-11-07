var mongoose = require("mongoose");
var schema = mongoose.Schema({
	name : { type : String }
});

module.exports = mongoose.model('Player', schema);