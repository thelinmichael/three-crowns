var mongoose = require("mongoose");
var Game = require("../models/game");
var should = require("should");

describe('Game', function() {

	before(function(done) {
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

	beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

	it("should know when game is started and not", function() {
		unit = new Game();
		unit.isStarted().should.equal(false);
		unit.startGame();
		unit.isStarted().should.equal(true);
		unit.endGame();
		unit.isStarted().should.equal(true);
	});

	it("should know when the game is ended and not", function() {
		unit = new Game();
		unit.isEnded().should.equal(false);
		unit.startGame();
		unit.isEnded().should.equal(false);
		unit.endGame();
		unit.isEnded().should.equal(true);
	});

	it("should know when the game is in progess and not", function() {
		unit = new Game();
		unit.inProgress().should.equal(false);
		unit.startGame();
		unit.inProgress().should.equal(true);
		unit.endGame();
		unit.inProgress().should.equal(false);
	});

});