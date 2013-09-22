var mongoose = require("mongoose");
var mockery = require("mockery");
var Game = require("../models/game");
var should = require("should");

// Mocks
var Player = require("./mocks/player");
mockery.registerMock('./mocks/player', Player);

describe('Game', function() {

	before(function(done) {
		mockery.enable();
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
  });

  after(function(done) {
  	mockery.disable();
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

	// Use a spy to see if the property is changed
	it("should not be able to reset the starting time");

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

  it("should successfully be able to mock a player", function() {
    player = new Player();
    player.should.exist;
    player.isMock().should.equal.true;
  });

	it("should be able to add players to the game", function() {
    var game = new Game();
  });

	it("should only be able to add players when the game is not yet started");

	it("should populate a new game with appropriate tiles");

});