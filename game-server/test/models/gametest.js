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
    unit.start();
    unit.isStarted().should.equal(true);

    /* A player should have received meeples */
    firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    firstPlayersMeeples.length.should.equal(BaseGame.meeples.length);

    unit.getActivePlayer().getName().should.equal(player1.getName());

    /* Place tiles on the first available placement until they run out */
    var previousRoundPlayer;
    while (unit.inProgress()) {
      var possibleTilePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      if (unit.inProgress()) {
        unit.placeTile(possibleTilePlacements[0].x, possibleTilePlacements[0].y, possibleTilePlacements[0].rotations[0]);
        if (previousRoundPlayer) {
          unit.currentRound.player.should.equal((previousRoundPlayer+1) % 2);
        }

        var possibleMeeplePlacements = unit.getPossibleMeeplePlacements();
        if (possibleMeeplePlacements.length > 0) {
          var meeples = unit.getActivePlayersMeeples();
          if (meeples.length > 0) {
            unit.placeMeeple(possibleMeeplePlacements[0].x, possibleMeeplePlacements[0].y, possibleMeeplePlacements[0].areas[0], meeples[0]);
          }
        } else {
          unit.nextTurn();
        }
      }
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
      var possibleTilePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      possibleTilePlacements.length.should.not.equal(0, "No possible placements for tile " + unit.getActiveTile().name + "with board " + unit.board.tiles);
      unit.placeTile(possibleTilePlacements[0].x, possibleTilePlacements[0].y, Rotations.NONE);
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

  it("should place a meeple on a connectable area that is not already occupied", function() {
    var unit = new Game();
    var regularMeeple = require("../../libs/gamepacks/basegame/meeples/regular-meeple");
    unit.startingKit.meeples = [regularMeeple];

    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });
    unit.addPlayer(player1);
    unit.addPlayer(player2);

    var halfCircleCastleWithRoad = require("../../libs/gamepacks/basegame/tiles/d-halfcircle-castle-and-road");
    var curvedRoad = require("../../libs/gamepacks/basegame/tiles/v-curved-road");

    unit.tiles = [halfCircleCastleWithRoad, curvedRoad];
    var options = {
      shuffle : {
        "orderByPriority" : true,
        "randomiseSamePriority" : false
      }
    };
    unit.start(options);

    unit.placeTile(0, 0, Rotations.NONE);

    var possibleMeeplePlacements1 = unit.getPossibleMeeplePlacements();
    should.exist(possibleMeeplePlacements1);
    possibleMeeplePlacements1[0].areas.length.should.equal(4);

    var meeples = unit.getActivePlayersMeeples();
    unit.placeMeeple(possibleMeeplePlacements1[0].x, possibleMeeplePlacements1[0].y, possibleMeeplePlacements1[0].areas[1], meeples[0]);

    unit.placeTile(0, 1, Rotations.NONE);

    var possibleMeeplePlacements2 = unit.getPossibleMeeplePlacements();
    should.exist(possibleMeeplePlacements2);
    possibleMeeplePlacements2[0].areas.length.should.equal(2);
  });

  it("can place meeples on internals areas such as monsteries", function() {
    var unit = new Game();
    var regularMeeple = require("../../libs/gamepacks/basegame/meeples/regular-meeple");
    unit.startingKit.meeples = [regularMeeple];

    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });
    unit.addPlayer(player1);
    unit.addPlayer(player2);

    var roadToMonastery = require("../../libs/gamepacks/basegame/tiles/a-road-to-monastery");
    var grassMonastery = require("../../libs/gamepacks/basegame/tiles/b-grass-monastery");

    unit.tiles = [roadToMonastery, grassMonastery];

    var options = {
      shuffle : {
        "orderByPriority" : true,
        "randomiseSamePriority" : false
      }
    };
    unit.start(options);

    unit.placeTile(0, 0, Rotations.NONE);

    var possibleMeeplePlacements1 = unit.getPossibleMeeplePlacements();
    should.exist(possibleMeeplePlacements1);
    possibleMeeplePlacements1[0].areas.length.should.equal(3);

    var meeples = unit.getActivePlayersMeeples();
    unit.placeMeeple(possibleMeeplePlacements1[0].x, possibleMeeplePlacements1[0].y, possibleMeeplePlacements1[0].areas[2], meeples[0]);

    unit.placeTile(-1, 0, Rotations.NONE);

    var possibleMeeplePlacements2 = unit.getPossibleMeeplePlacements();
    possibleMeeplePlacements2[0].areas.length.should.equal(2);
  });

  it("should keep track of which round it is", function() {
      var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

      var player1 = new Player({ "name" : "Michael" });
      var player2 = new Player({ "name" : "Jenni" });
      unit.addPlayer(player1);
      unit.addPlayer(player2);

      var currentRoundNumber0 = unit.getCurrentRoundNumber();
      should.exist(currentRoundNumber0);
      currentRoundNumber0.should.equal(0);

      unit.start();

      var currentRoundNumber1 = unit.getCurrentRoundNumber();
      should.exist(currentRoundNumber1);
      currentRoundNumber1.should.equal(1);

      unit.placeTile(0, 0, Rotations.NONE);

      unit.nextTurn();

      var currentRoundNumber2 = unit.getCurrentRoundNumber();
      should.exist(currentRoundNumber2);
      currentRoundNumber2.should.equal(2);
  });

  describe("Actions", function() {

    it("can get actions both with or without name", function() {
      var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

      var player1 = new Player({ "name" : "Michael" });
      var player2 = new Player({ "name" : "Jenni" });
      unit.addPlayer(player1);
      unit.addPlayer(player2);

      unit.start();

      var actions = unit.getActionsByName("PlaceTile");
      actions.length.should.equal(1);
      actions[0].name.should.equal("PlaceTile");

      var mandatoryActions = unit.getMandatoryActions();
      mandatoryActions.length.should.equal(1);
      mandatoryActions[0].name.should.equal("PlaceTile");

      var optionalActions = unit.getOptionalActions();
      optionalActions.length.should.equal(0);
    });

    it("should automatically end round when no more actions are left", function() {
      var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

      var player1 = new Player({ "name" : "Michael" });
      var player2 = new Player({ "name" : "Jenni" });
      unit.addPlayer(player1);
      unit.addPlayer(player2);

      var currentRoundNumber0 = unit.getCurrentRoundNumber();
      currentRoundNumber0.should.equal(0);

      unit.start();

      var currentRoundNumber1 = unit.getCurrentRoundNumber();
      currentRoundNumber1.should.equal(1);

      var actionsLeft1 = unit.getActions();
      actionsLeft1.length.should.equal(1);

      unit.placeTile(0, 0, Rotations.NONE);

      /* Has one meeple laying action left */
      var actionsLeft2 = unit.getActions();
      actionsLeft2.length.should.equal(1);

      var possibleMeeplePlacements = unit.getPossibleMeeplePlacements();
      var meeples = unit.getActivePlayersMeeples();
      unit.placeMeeple(possibleMeeplePlacements[0].x, possibleMeeplePlacements[0].y, possibleMeeplePlacements[0].areas[0], meeples[0]);

      /* No actions are left, and should be the second round */
      var currentRoundNumber2 = unit.getCurrentRoundNumber();
      currentRoundNumber2.should.equal(2);
    });

    it("should not be able to force a new turn when mandatory actions are left, even if there are optional actions", function() {
      var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

      var player1 = new Player({ "name" : "Michael" });
      var player2 = new Player({ "name" : "Jenni" });
      unit.addPlayer(player1);
      unit.addPlayer(player2);

      var currentRoundNumber0 = unit.getCurrentRoundNumber();
      currentRoundNumber0.should.equal(0);

      unit.start();

      var mandatoryActionsLeft = unit.getMandatoryActions();
      mandatoryActionsLeft.length.should.equal(1);

      (function() {
        unit.nextTurn();
      }).should.throw();

      unit.placeTile(0, 0, Rotations.NONE);

      var mandatoryActionsLeft2 = unit.getMandatoryActions();
      mandatoryActionsLeft2.length.should.equal(0);

      var optionalActionsLeft = unit.getOptionalActions();
      optionalActionsLeft.length.should.equal(1);

      (function() {
        unit.nextTurn();
        }).should.not.throw();
    });

  });
});