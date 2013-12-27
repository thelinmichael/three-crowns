var mongoose = require("mongoose");

/**
 * This model describes a strategy to shuffle the deck before the game is starting.
 * The purpose of having this as a separate module is to be able to insert a
 * different strategy that makes testing easier (e.g. doesn't shuffle).
 */
var DrawpileShufflingStrategy = {
  /**
   * @params {Array} tiles Tiles that will be shuffled.
   * @returns {Array} Returns an array of tiles placed in order of priority,
   * and random if priority is equal between several tiles.
   */
  shuffle : function(tiles) {
    var shuffledTiles = _randomise(tiles);
    shuffledTiles.sort(function(tile1, tile2) {
      if (tile1.priority > tile2.priority) {
        return -1;
      } else if (tile1.priority < tile2.priority) {
        return 1;
      } else {
        return 0;
      }
    });
    return tiles;
  }
};

/* Randomises the elements in an array, courtesy of Google */
var _randomise = function(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

module.exports = DrawpileShufflingStrategy;