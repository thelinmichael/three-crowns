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

  beforeEach(function(done) {
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

    (function() {
        unit.end();
    }).should.throw();
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
    game.getQueuedTiles.should.throw();

    game.start();
    game.isStarted().should.equal(true);
    should.exist(game.getBoard());
    var queuedTiles = game.getQueuedTiles();
    should.exist(queuedTiles);
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

  it("should know which player is in control each turn", function() {
    var game = generateGenericGame();
    (function() {
      game.getActivePlayer();
    }).should.throw();

    var firstPlayer = game.getPlayers()[0];
    var secondPlayer = game.getPlayers()[1];

    game.start();

    var activePlayerFirstRound = game.getActivePlayer();
    should.exist(activePlayerFirstRound);
    activePlayerFirstRound.should.equal(firstPlayer);

    game.nextTurn();

    var activePlayerSecondRound = game.getActivePlayer();
    should.exist(activePlayerSecondRound);
    activePlayerSecondRound.should.equal(secondPlayer);

    game.nextTurn();

    var activePlayerThirdRound = game.getActivePlayer();
    should.exist(activePlayerThirdRound);
    activePlayerThirdRound.should.equal(firstPlayer);

    game.nextTurn();

    var activePlayerFourthRound = game.getActivePlayer();
    should.exist(activePlayerFourthRound);
    activePlayerFourthRound.should.equal(secondPlayer);
  });

  it("should end the game that tiles decrease every turn", function() {
    var game = generateGenericGame();
    game.start();

    game.getQueuedTiles().length.should.equal(4);
    game.placeTile(0, 0);
    game.getQueuedTiles().length.should.equal(3);
    game.getBoard().getNumberOfTiles().should.equal(1);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(3);
    game.getBoard().getNumberOfTiles().should.equal(1);

    game.placeTile(1, 0);
    game.getQueuedTiles().length.should.equal(2);
    game.getBoard().getNumberOfTiles().should.equal(2);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(2);
    game.placeTile(1, 1);
    game.getQueuedTiles().length.should.equal(1);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(1);
    game.placeTile(1, 2);
    game.getQueuedTiles().length.should.equal(0);
  });

  it("should end the game when moving to the next turn after all tiles are used", function() {
    var game = generateGenericGame();
    game.start();

    game.getQueuedTiles().length.should.equal(4);
    game.placeTile(0, 0);
    game.nextTurn();
    game.isEnded().should.equal(false);

    game.getQueuedTiles().length.should.equal(3);
    game.placeTile(1, 0);
    game.nextTurn();
    game.isEnded().should.equal(false);

    game.getQueuedTiles().length.should.equal(2);
    game.placeTile(0, 1);
    game.nextTurn();
    game.isEnded().should.equal(false);

    game.getQueuedTiles().length.should.equal(1);
    game.placeTile(0, 2);
    game.getQueuedTiles().length.should.equal(0);
    game.nextTurn();
    game.isEnded().should.equal(true);
  });

  it.skip("should know which tile is going to be placed every turn");

});

var generateGenericGame = function() {
    var player1 = new Player({ name : "Michael" });
    var player2 = new Player({ name : "Jenni"});
    var players = [player1, player2];

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.GRASS } });
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS } });
    var tile3 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.CASTLE } });
    var tile4 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS } });
    var startingTiles = [tile1, tile2, tile3, tile4];

    return new Game({ "tileQueue" : startingTiles, "players" : players });
}