var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../libs/gamebuilder');

describe("GameHandler", function() {

  it("Can create a game with the basepack", function() {
    var game = GameBuilder.create();
    should.exist(game);
  });

});