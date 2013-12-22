var Game = require("./models/game.js");

var _defaultOptions = {
  gamepacks : ['basegame']
}

function GameHandler(options) {
  this.options = _defaultOptions;
  this.options.extend(options);

  this.game = new Game();

  var gamepacks = _loadPacks(this.options.gamepacks);
  game.addPacks(gamepacks);
};

GameHandler.prototype.start = function(options) {

};

/**
 * @params {Array} gamepacks An Array of gamepack identifiers/folder names.
 * @returns {Array} An array of the gamepacks in {gamepacks}, but the actual modules
 */
var _loadPacks = function(gamepacks) {
  return gamepacks.map(function(gamepack) {
    return require('./gamepacks/' + gamepack + '/main');
  });
};

exports = module.exports = GameHandler;