var mongoose = require("mongoose");
var Game = require("../models/game");
var Player = require("../models/player");
var sinon = require("sinon");
var should = require("should");
var assert = require("assert");

describe('Game', function() {

	before(function(done) {
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
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
	it("should not be able to reset the starting time", function() {
    unit = new Game();
    var startingTime = unit.getStartingTime();
    should.not.exist(startingTime);
    unit.startGame();
    startingTime = unit.getStartingTime();
    should.exist(startingTime);
    unit.startGame();
    var startingTimeAfterSecondStart = unit.getStartingTime();
    startingTime.should.equal(startingTimeAfterSecondStart);
  });

	it("should know when the game is ended and not", function() {
		unit = new Game();
		unit.isEnded().should.equal(false);
		unit.startGame();
		unit.isEnded().should.equal(false);
		unit.endGame();
		unit.isEnded().should.equal(true);
	});

  it("should not end game if it hasn't started", function() {
    unit = new Game();

    unit.endGame();
    var endTimeNotSet = unit.getEndTime();
    should.not.exist(endTimeNotSet);
    unit.startGame();

    unit.endGame();
    var endTimeSet = unit.getEndTime();
    should.exist(endTimeSet);
  });

	it("should know when the game is in progess and not", function() {
		unit = new Game();
		unit.inProgress().should.equal(false);
		unit.startGame();
		unit.inProgress().should.equal(true);
		unit.endGame();
		unit.inProgress().should.equal(false);
	});

	it("should only be able to add players when the game is not yet started", function() {
    var game = new Game();

    var player1 = new Player({ name : "beforeStart" });
    game.addPlayer(player1);

    game.startGame();
    var player2 = new Player({ name : "afterStart" });
    (function() {
      game.addPlayer(player2);
    }).should.throw();

    game.endGame();

    var player3 = new Player({ name : "afterEnd" });
    (function() {
      game.addPlayer(player3);
    }).should.throw();
  });

	it("should populate a new game with appropriate tiles", function() {
    var game = new Game();

    var player1 = new Player({ name : "Michael" });
    game.addPlayer(player1);
    var player2 = new Player({ name : "Jenni"});
    game.addPlayer(player2);

    game.isStarted().should.equal(false);
    game.getUnplacedTiles.should.throw();

    game.startGame();
    game.isStarted().should.equal(true);
    should.exist(game.getBoard());
    var unplacedTiles = game.getUnplacedTiles();
    should.exist(unplacedTiles);
  });

  it("should only return a board if the game has started", function() {
    var game = new Game();

    (function() {
      game.getBoard();
    }).should.throw();

    game.startGame();

    var board = game.getBoard();
    should.exist(board);
  });
});