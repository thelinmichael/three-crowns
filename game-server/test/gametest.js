var mongoose = require("mongoose");
var unit = require("../models/game");
var should = require("should");

describe('Game', function() {

	before(function(done) {
		mongoose.disconnect(function() {
			try {
				mongoose.connect('mongodb://localhost/game_test');
				done();
			} catch (err) {
				console.log("Couldn't connect to MongoDB", err);
				should.fail();
			}
		})
	});

	beforeEach(function(done) {
		unit.model.remove({}, function(err) {
			should.not.exist(err);

			unit.model.count(function(err, count) {
				should.not.exist(err);
				count.should.equal(0);

				done();
			});
		});
	});

	it("Should be able to create a game", function(done) {
		unit.newGame(function(err) {
			should.not.exist(err);
			unit.model.count(function(err, count) {
				should.not.exist(err);
				count.should.equal(1);
				done();
			});
		});
	});

	after(function(done) {
		mongoose.disconnect(function() {
			done();
		});
	});

});