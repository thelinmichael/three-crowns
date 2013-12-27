var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../../libs/gamebuilder');
var Player = require("../../libs/models/player");
var Tile = require("../../libs/models/tile");
var Rotations = require("../../libs/models/tile").Rotations;
var BasePack = require("../../libs/gamepacks/basegame/main");

describe("Game", function() {

  /**
   *  This is a test that creates a game with a test gamepack
   *  for two players. The testpack consists of the same types of tiles
   *  as the basegame, but with much fewer tiles. All tiles are placed,
   *  and the final score is counted.
   */
  it("Should be played the game from end to end", function() {
    var unit = GameBuilder.create({ gamepacks : ['basegame'] });

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

    should.exist(unit.tiles);
    unit.tiles.length.should.equal(BasePack.getTiles().length);

    /* A player should have received six meeples */
    firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    firstPlayersMeeples.length.should.equal(BasePack.getMeeples().length);

    unit.getActivePlayer().getName().should.equal(player1.getName());

    /* Place tile in origo without rotation */
    unit.currentRound.tile.should.equal(0);
    unit.board.hasTile(0, 0).should.equal(false);
    unit.placeTile(0, 0, Rotations.NONE);
    unit.board.hasTile(0, 0).should.equal(true);

    /* Go to next turn */
    unit.nextTurn();

    unit.currentRound.tile.should.equal(1);
    unit.currentRound.player.should.equal(1);

    var possiblePlacements = unit.board.getPossiblePlacementsForTile(unit.getActiveTile());
    should.exist(possiblePlacements);
    possiblePlacements.length.should.not.equal(0);
  });

});