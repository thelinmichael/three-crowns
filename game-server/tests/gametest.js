var mongoose = require("mongoose");
var unit = require("../models/game");

mongoose.connect('mongodb://localhost/game_test');

describe('Game', function() {
	it("Can start and end", function(done) {
		var response = unit.getResponse();
		done();
	});
});