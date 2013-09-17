var Game = function() {
	var mongoose = require("mongoose");

	var schema = mongoose.Schema({
		created : Date,
    start: Date,
    end : Date
	});

	schema.methods.startGame = function() {

	};

	schema.methods.isStarted = function() {
		return created;
	};

	var _model = mongoose.model('Game', schema);

	var _newGame = function(callback) {
		var game = new _model();
		game.save(function(err) {
				callback(err);
		});
	};

	var _startGame = function(callback) {

	}

	return {
		newGame : _newGame,
		startGame : _startGame,
		model : _model
	}

}();

module.exports = Game;