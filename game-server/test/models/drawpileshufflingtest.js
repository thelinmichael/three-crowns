var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var DrawpileShufflingStrategy = require("../../libs/models/drawpile-shuffling-strategy.js");

var CrossroadsTile = require("../../libs/gamepacks/basegame/tiles/crossroads.js");
var WestNorthRoadTile = require("../../libs/gamepacks/basegame/tiles/westnorth-road.js");
var WestEastRoadTile = require("../../libs/gamepacks/basegame/tiles/westeast-road.js");

var Rotations = require("../../libs/models/tile").Rotations;

describe("Deck shuffling", function() {

  it("Should place all tiles in random order", function() {
    var tiles = [CrossroadsTile, WestNorthRoadTile, WestEastRoadTile];
    var shuffledTiles = DrawpileShufflingStrategy.shuffle(tiles);

    should.exist(shuffledTiles);
    shuffledTiles.length.should.equal(3);
    /* TODO: Check if the order is actually random */
  });

  /* TODO: This needs River tiles which are of higher priority. */
  it("Should place all tiles in order of priority, and random if the priority is the same");

});