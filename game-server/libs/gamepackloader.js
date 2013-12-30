var Gamepack = require("./gamepack");

var GamepackLoader = {

  /**
   * @params {Array} An array of gamepack ids.
   * @returns {Array} An array of {Gamepack}
   */
  loadPacks : function(gamepackIds) {
    var self = this;
    var loadedGamePacks = gamepackIds.map(function(gamepackId) {
      return self.loadPack(gamepackId);
    });
    return loadedGamePacks;
  },

  /* Load a single gamepack */
  loadPack : function(gamepackId) {
    var config = require('./gamepacks/' + gamepackId + '/config.json');
    var gamepack = new Gamepack(config);
    return gamepack;
  }

};

module.exports = GamepackLoader;