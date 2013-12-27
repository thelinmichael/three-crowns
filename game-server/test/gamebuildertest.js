var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var GameBuilder = require('../libs/gamebuilder');

describe("GameBuilder", function() {

  it("Can create a game with the components from the basegame", function() {
    var game = GameBuilder.create({ gamepacks : ['basegame'] });
    should.exist(game);
  });

});