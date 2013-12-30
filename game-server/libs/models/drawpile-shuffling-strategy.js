/**
 * This model describes a strategy to shuffle the deck before the game is starting.
 */

var defaultOptions = {
  "orderByPriority" : true,
  "randomiseSamePriority" : true
};

var DrawpileShufflingStrategy = {

  /**
   * @params {Array} tiles Tiles that will be shuffled.
   * @params {Object} options Options such as if shuffling should include randomisation, for example.
   * @returns {Array} Returns an array of tiles placed in order of priority,
   * and random if priority is equal between several tiles.
   */
  shuffle : function(tiles, options) {
    options = _fillInMissingOptions(options, defaultOptions);

    if (options.randomiseSamePriority) {
      tiles = _randomise(tiles);
    }

    if (options.orderByPriority) {
      tiles.sort(function(tile1, tile2) {
        if (tile1.priority > tile2.priority) {
          return -1;
        } else if (tile1.priority < tile2.priority) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    return tiles;
  }
};

/* Randomises the elements in an array, courtesy of Google */
var _randomise = function(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function _fillInMissingOptions(options, defaultOptions) {
  if (!options) {
    return defaultOptions;
  }

  for (var key in defaultOptions) {
    if (defaultOptions.hasOwnProperty(key) && options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  }
  return options;
}

module.exports = DrawpileShufflingStrategy;