var assert = require('assert');
var should = require('should');

var DrawPileShuffler = require("../../libs/drawpile-shuffling-strategy");

var GamepackLoader =require("../../libs/gamepackloader");

describe("Draw pile shuffling", function() {

  it("should place all tiles in order of priority, and random if the priority is the same", function() {
    var BaseGame = GamepackLoader.loadPack("basegame");
    var River = GamepackLoader.loadPack("river");

    var BaseGameTiles = BaseGame.tiles;
    var RiverTiles = River.tiles;

    var unshuffledTiles = BaseGameTiles.concat(RiverTiles);

    var shuffledTiles = DrawPileShuffler.shuffle(unshuffledTiles);
    shuffledTiles.length.should.equal(unshuffledTiles.length);

    var previousTilesPriority;
    var inPriorityOrder = shuffledTiles.every(function(tile, index) {
      if (index > 0) {
        previousTilesPriority = shuffledTiles[index-1].priority;
        return previousTilesPriority >= tile.priority;
      } else {
        return true;
      }
    });
    inPriorityOrder.should.equal(true);
  });

});