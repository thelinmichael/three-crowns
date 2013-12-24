var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var Board = require('../../libs/models/board');

var BaseGame = require("../../libs/gamepacks/basegame/main");

describe("Board", function() {

  it("Can get positions on the board that are free and adjacent to another tiles", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();

    should.exist(unplacedTiles);

    var canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], 0);
    (canPlaceFirstTileAtOrigo).should.equal(true);
    (unit.hasTile(0, 0)).should.equal(false);
    unit.placeTile(0, 0, unplacedTiles[0], 0);
    (unit.hasTile(0, 0)).should.equal(true);

    canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], 0);
    (canPlaceFirstTileAtOrigo).should.equal(false);

    var possiblePositions = unit.getPossiblePositions();
    (possiblePositions.length).should.equal(4);
    possiblePositions.indexOf([1,0]).should.not.equal(-1);
    possiblePositions.indexOf([-1,0]).should.not.equal(-1);
    possiblePositions.indexOf([0,1]).should.not.equal(-1);
    possiblePositions.indexOf([0,-1]).should.not.equal(-1);
  });

  it.skip("Can get possible placements", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();

    unit.placeTile(0, 0, unplacedTiles[0], 0);
  });

});