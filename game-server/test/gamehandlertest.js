var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameHandler = require('../libs/gamehandler');

describe("GameHandler", function() {

  it("Can create a game with the basepack", function() {
    var gameHandler = new GameHandler();
    should.exist(gameHandler.game);
  });

});