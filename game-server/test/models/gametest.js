var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../../libs/gamebuilder');
var Player = require("../../libs/models/player");
var Tile = require("../../libs/models/tile");
var Rotations = require("../../libs/models/tile").Rotations;
var BasePack = require("../../libs/gamepacks/basegame/main");
var River = require("../../libs/gamepacks/river/main")

describe("Game", function() {

  /**
   *  This is a test that creates a game with a the basepack and the river
   *  and plays the tiles to the end with two players.
   */
  it("Should be played the game from end to end", function() {
    var unit = GameBuilder.create({ gamepacks : ['basegame', 'river'] });

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
    firstPlayersMeeples.length.should.equal(BasePack.getMeeples().length);

    unit.getActivePlayer().getName().should.equal(player1.getName());

    /* Place tiles on the first available placement until they run out */
    var previousRoundPlayer;
    for (var i = 0; i < unit.tiles.length; i++) {
      var possiblePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
      unit.placeTile(possiblePlacements[0].x, possiblePlacements[0].y, Rotations.NONE);

      unit.isEnded().should.equal(false);
      if (previousRoundPlayer) {
        unit.currentRound.player.should.equal((currentPlayerIndex+1) % 2);
      }

      unit.nextTurn();
      currentPlayerIndex = unit.currentRound.player;
    }

    unit.board.getNumberOfTiles().should.equal(unit.tiles.length);
    unit.isEnded().should.equal(true);
  });

});