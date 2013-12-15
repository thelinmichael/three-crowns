var mongoose = require("mongoose");
var Game = require("../../libs/models/game");
var Player = require("../../libs/models/player");
var Tile = require("../../libs/models/tile");
var Fixtures = require("../fixtures/fixtures");
var sinon = require("sinon");
var should = require("should");
var assert = require("assert");

describe('Game', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/game', done);
  });

  beforeEach(function(done) {
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

  it("should know when game is started and not", function() {
    var unit = new Game();
    unit.isStarted().should.equal(false);
    unit.start();
    unit.isStarted().should.equal(true);
    unit.end();
    unit.isStarted().should.equal(true);
  });

  it("should know when the game is ended and not", function() {
    var unit = new Game();
    unit.isEnded().should.equal(false);
    unit.start();
    unit.isEnded().should.equal(false);
    unit.end();
    unit.isEnded().should.equal(true);
  });

  it("should not be able to reset the starting time", function() {
    var unit = new Game();
    (function() {
        unit.getStartingTime();
    }).should.throw();
    unit.start();
    var startingTime;
    (function() {
        startingTime = unit.getStartingTime();
    }).should.not.throw();
    should.exist(startingTime);

    // Should throw an error as game has already been started
    (function() {
      unit.start();
    }).should.throw();

    var startingTimeAfterSecondStart = unit.getStartingTime();
    startingTime.should.equal(startingTimeAfterSecondStart);
  });

  it("should not be able to end game if it hasn't started", function() {
    var unit = new Game();

    (function() {
        unit.end();
    }).should.throw();
    var endTimeNotSet;
    (function() {
        endTimeNotSet = unit.getEndTime();
    }).should.throw();
    should.not.exist(endTimeNotSet);
    unit.start();

    unit.end();
    var endTimeSet = unit.getEndTime();
    should.exist(endTimeSet);
  });

	it("should know when the game is in progress and not", function() {
		var unit = new Game();
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

  it("tiles should decrease every turn", function() {
    var game = generateGenericGame();
    game.start();

    game.getQueuedTiles().length.should.equal(4);
    game.placeTile(0, 0, 0);
    game.getQueuedTiles().length.should.equal(3);
    game.getBoard().getNumberOfTiles().should.equal(1);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(3);
    game.getBoard().getNumberOfTiles().should.equal(1);

    game.placeTile(1, 0, 0);
    game.getQueuedTiles().length.should.equal(2);
    game.getBoard().getNumberOfTiles().should.equal(2);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(2);
    game.placeTile(0, 1, 2);
    game.getQueuedTiles().length.should.equal(1);

    game.nextTurn();
    game.getQueuedTiles().length.should.equal(1);
    game.placeTile(0, 2, 0);
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

  it("should know which tile is going to be placed every turn", function() {
    var game = generateGenericGame();
    game.start();

    var tile1 = game.getQueuedTiles()[0];
    var tile2 = game.getQueuedTiles()[1];
    var tile3 = game.getQueuedTiles()[2];
    var tile4 = game.getQueuedTiles()[3];

    var activeTile_roundOne = game.getActiveTile();
    game.placeTile(0, 0);
    should.exist(activeTile_roundOne);
    activeTile_roundOne.should.equal(game.getBoard().getTile(0, 0));
    game.nextTurn();

    var activeTile_roundTwo = game.getActiveTile();
    game.placeTile(1, 0);
    activeTile_roundTwo.should.equal(game.getBoard().getTile(1, 0));
    game.nextTurn();

    var activeTile_roundThree = game.getActiveTile();
    game.placeTile(0, 1);
    activeTile_roundThree.should.equal(game.getBoard().getTile(0, 1));
    game.nextTurn();

    var activeTile_roundFour = game.getActiveTile();
    game.placeTile(0, 2);
    activeTile_roundFour.should.equal(game.getBoard().getTile(0, 2));
    game.nextTurn();
  });

});

var generateGenericGame = function() {
    var player1 = new Player({ name : "Michael" });
    var player2 = new Player({ name : "Jenni"});
    var players = [player1, player2];

    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateCrossroadsTile();
    var tile3 = Fixtures.generateWestNorthCorner();
    var tile4 = Fixtures.generateWestNorthCorner();
    var startingTiles = [tile1, tile2, tile3, tile4];

    return new Game({ "tileQueue" : startingTiles, "players" : players });
};