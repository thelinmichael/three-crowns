var Game = function() {
	var mongoose = require("mongoose");

	var schema = mongoose.Schema({
    start: Date,
    end : Date
	});
	var _model = mongoose.model('Game', schema);

	var _newGame = function(callback) {
		var game = new _model();
		game.save(function(err) {
				callback(err);
		});
	};

	return {
		newGame : _newGame,
		model : _model
	}

}();

module.exports = Game;