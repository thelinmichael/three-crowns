var Game = require("./models/game.js");

var _defaultOptions = {
  gamepacks : ['basegame']
}

var create = function(options) {
  this.options = _defaultOptions;
  extend(this.options, options);

  var game = new Game();

  var gamepacks = _loadPacks(this.options.gamepacks);
  game.addPacks(gamepacks);

  return game;
};

/**
 * @params {Array} gamepacks An Array of gamepack identifiers/folder names.
 * @returns {Array} An array of the gamepacks in {gamepacks}, but the actual modules
 */
var _loadPacks = function(gamepacks) {
  var loadedGamePacks = gamepacks.map(function(gamepack) {
    return require('./gamepacks/' + gamepack + '/main');
  });
  return loadedGamePacks;
};

/**
 * Adds the source's properties to the source properties
 */
var extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

exports = module.exports;
exports.create = create;