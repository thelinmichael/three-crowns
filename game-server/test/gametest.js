var mongoose = require("mongoose");
var Game = require("../models/game");
var Player = require("../models/player");
var sinon = require("sinon");
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

	it("should know when the game is in progess and not", function() {
		unit = new Game();
		unit.inProgress().should.equal(false);
		unit.startGame();
		unit.inProgress().should.equal(true);
		unit.endGame();
		unit.inProgress().should.equal(false);
	});

	it("should be able to add players to an unstarted game", function() {
    var game = new Game();
    game.getPlayers().length.should.equal(0);
    var playerJenni = new Player({ name : "Jenni" });

    var spy = sinon.spy();
    game.addPlayer(playerJenni, spy);
    spy.calledOnce.should.equal(true);
    spy.calledWith().should.equal(true);
    game.getPlayers().length.should.equal(1);

    spy.reset();
    game.addPlayer(playerJenni, spy);
    spy.calledOnce.should.equal(true);
    spy.calledWith({ "error" : "Player already exists in the game"}).should.equal(true)
    game.getPlayers().length.should.equal(1);

    spy.reset();
    var playerMicke = new Player({ name : "Micke" });
    game.addPlayer(playerMicke, spy);
    spy.calledOnce.should.equal(true);
    spy.calledWith().should.equal(true);
    game.getPlayers().length.should.equal(2);
  });

	it("should only be able to add players when the game is not yet started", function() {
    var game = new Game();

    var spy = sinon.spy();
    var player = new Player({ name : "beforeStart" });
    game.addPlayer(player, spy);
    spy.calledOnce.should.equal(true);
    spy.calledWith().should.equal(true);

    spy.reset();
    game.startGame();
    var player = new Player({ name : "afterStart" });
    game.addPlayer(player, spy);
    spy.calledOnce.should.equal(true);
    spy.calledWith({ "error" : "Players cannot be added once game has started" }).should.equal(true);
  });

	it("should populate a new game with appropriate tiles");

});