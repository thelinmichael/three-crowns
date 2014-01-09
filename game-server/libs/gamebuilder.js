var Game = require("./models/game.js");

var GameBuilder = function() {
  var self = this;

  this.game = new Game();
};

GameBuilder.prototype.build = function(callback) {
  this.game.save(function(err, game) {
    callback(err, game);
  });
};

module.exports = GameBuilder;