var Player = function() {

	var mongoose = require("mongoose");

	var schema = mongoose.Schema({
  		name: { type: String, required : true }
	});
	var _model = mongoose.model('Player', schema);

	var _newPlayer = function(name, callback) {
		var player = new _model({ "name" : name });
		player.save(function(err) {
			callback(err);
		});
	};

	return {
		newPlayer : _newPlayer,
		model : _model
	}

}();

module.exports = Player;