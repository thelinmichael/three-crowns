var Game = function() {
	var mongoose = require("mongoose");

	var schema = mongoose.Schema({
    start: Date,
    end : Date
	});
	var Game = mongoose.model('Game', schema);

	var _getResponse = function(callback) {
		return 1;
	};

	return {
		getResponse : _getResponse
	}

}();

module.exports = Game;