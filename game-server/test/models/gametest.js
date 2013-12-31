var assert = require('assert');
var should = require('should');

var GameBuilder = require('../../libs/gamebuilder');
var GamepackLoader = require("../../libs/gamepackloader");
var Player = require("../../libs/models/player");
var Tile = require("../../libs/models/abstract/tile");
var Game = require("../../libs/models/game");
var Rotations = require("../../libs/tile-rotations");

describe("Game", function() {

  /**
   *  This is a test that creates a game with a the basepack and the river
   *  and plays the tiles to the end with two players.
   */
  it("Should be played the game from end to end", function() {
    var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

    var BaseGame = GamepackLoader.loadPack("basegame");

    var players = unit.getPlayers();
    players.length.should.equal(0);

    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });

    unit.addPlayer(player1);
    unit.addPlayer(player2);

    /* Players should not have any meeples prior to start */
    var firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    firstPlayersMeeples.length.should.equal(0);

    /* Starting the game */
    unit.isStarted().should.equal(false);
     /* Randomising same priority tiles is turned off so that the tiles are ordered in a deterministic fashion.
       This helps prevent flaky tests. */
    var options = {
      shuffle : {
        "orderByPriority" : true,
        "randomiseSamePriority" : true
      }
    };
    unit.start(options);
    unit.isStarted().should.equal(true);

    /* A player should have received meeples */
    firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    firstPlayersMeeples.length.should.equal(BaseGame.meeples.length);

    unit.getActivePlayer().getName().should.equal(player1.getName());

    /* Place tiles on the first available placement until they run out */
    var previousRoundPlayer;
    for (var i = 0; i < unit.tiles.length; i++) {
      var possiblePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      if (possiblePlacements.length > 0) {
       unit.placeTile(possiblePlacements[0].x, possiblePlacements[0].y, possiblePlacements[0].rotations[0]);

        if (previousRoundPlayer) {
          unit.currentRound.player.should.equal((previousRoundPlayer+1) % 2);
        }
      }

      unit.isEnded().should.equal(false);
      unit.nextTurn();
      previousRoundPlayer = unit.currentRound.player;
    }
    unit.isEnded().should.equal(true);
  });

  it("should be able to lay out the river tiles", function() {
    var unit = GameBuilder.create({ gamepacks : ['river'] });
    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });
    unit.addPlayer(player1);
    unit.addPlayer(player2);

    /* Randomising same priority tiles is turned off so that the tiles are ordered in a deterministic fashion.
       This helps prevent flaky tests. */
    var options = {
      shuffle : {
        "orderByPriority" : true,
        "randomiseSamePriority" : false
      }
    };
    unit.start(options);

    /* Place tiles on the first available placement until they run out */
    for (var i = 0; i < unit.tiles.length; i++) {
      var possiblePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      possiblePlacements.length.should.not.equal(0, "No possible placements for tile " + unit.getActiveTile().name + "with board " + unit.board.tiles);
      unit.placeTile(possiblePlacements[0].x, possiblePlacements[0].y, Rotations.NONE);
      unit.nextTurn();
    }

    unit.board.getNumberOfTiles().should.equal(unit.tiles.length);
    unit.board.getTile(0,0).tile.name.should.equal("Mountain");
    unit.board.getTile(-3,0).tile.name.should.equal("Lake");

    unit.isEnded().should.equal(true);
  });

  it("should rotate tiles in order to be able to place all of them on the board", function() {
    var unit = new Game();

    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });
    unit.addPlayer(player1);
    unit.addPlayer(player2);

    var halfCircleCastleWithRoad = require("../../libs/gamepacks/basegame/tiles/d-halfcircle-castle-and-road");
    var westEastRoad = require("../../libs/gamepacks/basegame/tiles/v-curved-road");

    unit.tiles = [halfCircleCastleWithRoad, westEastRoad];
    var options = {
      shuffle : {
        "orderByPriority" : true,
        "randomiseSamePriority" : false
      }
    };
     unit.start(options);

    /* Place tiles on the first available placement until they run out */
    for (var i = 0; i < unit.tiles.length; i++) {
      var possiblePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      possiblePlacements.length.should.not.equal(0, "No possible placements for tile " + unit.getActiveTile().name + "with board " + unit.board.tiles);
      unit.placeTile(possiblePlacements[0].x, possiblePlacements[0].y, possiblePlacements[0].rotations[0]);
      unit.nextTurn();
    }

    unit.board.getNumberOfTiles().should.equal(unit.tiles.length);
    unit.isEnded().should.equal(true);
  });

});