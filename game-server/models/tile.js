var Tile = function() {
	var mongoose = require("mongoose");

	var schema = mongoose.Schema({
	  "id" : String,
	  "humanReadableId" : String,
	  "expansion" : String
	});
	var _model = mongoose.model('Tile', schema);

	var _newTile = function(callback) {
		var tile = new _model();
		tile.save(function(err) {
				callback(err);
		});
	};

	return {
		newTile: _newTile,
		model : _model
	}

}();

module.exports = Tile;