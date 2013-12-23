var mongoose = require("mongoose");

var Player = require("../libs/models/player");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../libs/gamebuilder');

describe("GameHandler", function() {

  it("Can create a game with the basepack", function() {
    var game = GameBuilder.create();
    should.exist(game);
  });

  it.skip("Can create a game with two players", function() {
    var unit = new GameBuilder();
    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });

    unit.addPlayer(player1);
    unit.addPlayer(player2);

    var players = unit.getPlayers();
    (players).should.exist();
    (players.length).should.equal(2);
  });

});