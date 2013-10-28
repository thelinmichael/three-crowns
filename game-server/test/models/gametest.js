var mongoose = require("mongoose");
var Game = require("../../lib/models/game");
var Player = require("../../lib/models/player");
var Tile = require("../../lib/models/tile");
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
		unit.start();
		unit.isStarted().should.equal(true);
		unit.end();
		unit.isStarted().should.equal(true);
	});

	// Use a spy to see if the property is changed
	it("should not be able to reset the starting time", function() {
    unit = new Game();
    var startingTime = unit.getStartingTime();
    should.not.exist(startingTime);
    unit.start();
    startingTime = unit.getStartingTime();
    should.exist(startingTime);
    unit.start();
    var startingTimeAfterSecondStart = unit.getStartingTime();
    startingTime.should.equal(startingTimeAfterSecondStart);
  });

	it("should know when the game is ended and not", function() {
		unit = new Game();
		unit.isEnded().should.equal(false);
		unit.start();
		unit.isEnded().should.equal(false);
		unit.end();
		unit.isEnded().should.equal(true);
	});

  it("should not end game if it hasn't started", function() {
    unit = new Game();

    unit.end();
    var endTimeNotSet = unit.getEndTime();
    should.not.exist(endTimeNotSet);
    unit.start();

    unit.end();
    var endTimeSet = unit.getEndTime();
    should.exist(endTimeSet);
  });

	it("should know when the game is in progess and not", function() {
		unit = new Game();
		unit.inProgress().should.equal(false);
		unit.start();
		unit.inProgress().should.equal(true);
		unit.end();
		unit.inProgress().should.equal(false);
	});

	it("should only be able to add players when the game is not yet started", function() {
    var game = new Game();

    var player1 = new Player({ name : "beforeStart" });
    game.addPlayer(player1);

    game.start();
    var player2 = new Player({ name : "afterStart" });
    (function() {
      game.addPlayer(player2);
    }).should.throw();

    game.end();

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

    game.start();
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

    game.start();

    var board = game.getBoard();
    should.exist(board);
  });

  it("should give unique tiles to players until there are no more tiles", function() {
    var game = new Game();

    var player1 = new Player({ name : "Michael" });
    game.addPlayer(player1);
    var player2 = new Player({ name : "Jenni"});
    game.addPlayer(player2);

    var startingTiles = [];
    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.GRASS } });
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS } });
    var tile3 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.CASTLE } });
    var tile4 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS } });
    startingTiles.push(tile1, tile2, tile3, tile4);

    game.start({ "unplacedTiles" : startingTiles });
  });

  it.skip("should remember which players turn it is", function() {
    var game = new Game();

    var player1 = new Player({ name : "Michael" });
    game.addPlayer(player1);
    var player2 = new Player({ name : "Jenni"});
    game.addPlayer(player2);

    game.start();
    var board = game.getBoard();
  });

  it("should remember how many meeples a user has");

});