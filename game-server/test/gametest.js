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

	it("should be able to create a game", function(done) {
		unit.newGame(function(err) {
			should.not.exist(err);
			unit.model.count(function(err, count) {
				should.not.exist(err);
				count.should.equal(1);
				done();
			});
		});
	});

	it("should know when the game is started and when it has ended", function(done) {
		unit.newGame(function(err) {
			should.not.exist(err);
			unit.model.isStarted().should.equal(false);
		});
	});

	it.skip("should not be able to start a game without players", function(done) {
		unit.newGame(function(err) {
			unit.startGame(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	it("should not be able to start a game without tiles");

	it("should not be able to start a game without players and tiles");

	after(function(done) {
		mongoose.disconnect(function() {
			done();
		});
	});

});