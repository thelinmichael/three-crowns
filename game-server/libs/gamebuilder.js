var Game = require("./models/game.js");
var GamepackLoader = require("./gamepackloader");

var defaultOptions = {
  gamepacks : ['basegame', 'single-starttile']
};

var create = function(options) {

  /* Any options that are missing are filled in with default options */
  for (var property in defaultOptions) {
    if (options[property] === undefined) {
      options[property] = defaultOptions[property];
    }
  }

  var gamepacks = GamepackLoader.loadPacks(options.gamepacks);

  var game = new Game();
  game.addPacks(gamepacks);

  return game;
};

exports = module.exports;
exports.create = create;