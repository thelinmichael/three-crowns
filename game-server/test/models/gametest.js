var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../../libs/gamebuilder');
var Player = require("../../libs/models/player");

describe("GameHandler", function() {

  it("End-To-End game test", function() {
    var unit = GameBuilder.create();
    var player1 = new Player({ "name" : "Michael" });
    var player2 = new Player({ "name" : "Jenni" });

    unit.addPlayer(player1);
    unit.addPlayer(player2);

    var players = unit.getPlayers();
    should.exist(players);
    (players.length).should.equal(2);

    (unit.isStarted()).should.equal(false);
    unit.start();
    (unit.isStarted()).should.equal(true);
  });


});