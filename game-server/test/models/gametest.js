var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../../libs/gamebuilder');
var Player = require("../../libs/models/player");

var BasePack = require("../../libs/gamepacks/basegame/main");

describe("Game", function() {

  it("End-To-End game test", function() {
    var unit = GameBuilder.create();

    var players = unit.getPlayers();
    (players.length).should.equal(0);

    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });

    unit.addPlayer(player1);
    unit.addPlayer(player2);

    players = unit.getPlayers();
    should.exist(players);
    (players.length).should.equal(2);

    /* Players should not have any meeples prior to start */
    var firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    (firstPlayersMeeples.length).should.equal(0);

    /* Players should not have any buildings prior to start */
    var firstPlayersBuildings = players[0].buildings;
    should.exist(firstPlayersBuildings);
    (firstPlayersBuildings.length).should.equal(0);

    /* Starting the game */
    (unit.isStarted()).should.equal(false);
    unit.start();
    (unit.isStarted()).should.equal(true);

    should.exist(unit.tiles);
    (unit.tiles.length).should.equal(BasePack.getTiles().length);

    /* A player should have received six meeples */
    firstPlayersMeeples = players[0].meeples;
    should.exist(firstPlayersMeeples);
    (firstPlayersMeeples.length).should.equal(BasePack.getStartingMeeples().length);

    /* Since we are playing with the basepack only, no buildings are given */
    firstPlayersBuildings = players[0].buildings;
    should.exist(firstPlayersBuildings);
    (firstPlayersBuildings.length).should.equal(0);

    unit.getActivePlayer().getName().should.equal(player1.getName());

    /* Place tile in origo without rotation */
    (unit.currentRound.tile).should.equal(0);
    (unit.board.hasTile(0, 0)).should.equal(false);
    unit.placeTile(0, 0, 0);
    (unit.board.hasTile(0, 0)).should.equal(true);

    /* Go to next turn */
    unit.nextTurn();

    (unit.currentRound.tile).should.equal(1);
    (unit.currentRound.player).should.equal(1);

    var possiblePlacements = unit.board.getPossiblePlacements();
    (possiblePlacements).should.exist();
    (possiblePlacements.length).should.not.equal(0);
  });

});