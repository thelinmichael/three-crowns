var mongoose = require("mongoose");

var assert = require('assert');
var should = require('should');

var Board = require('../../libs/models/board');

var BaseGame = require("../../libs/gamepacks/basegame/main");

describe("Board", function() {

  it("Can get the number of tiles placed on the board", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();

    (unit.getNumberOfTiles()).should.equal(0);
    unit.placeTile(0, 0, unplacedTiles[0], 0);

    (unit.getNumberOfTiles()).should.equal(1);
  });

  it("Can get positions on the board that are free and adjacent to another tiles", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();
    should.exist(unplacedTiles);

    var canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], 0);
    (canPlaceFirstTileAtOrigo).should.equal(true);
    (unit.hasTile(0, 0)).should.equal(false);
    unit.placeTile(0, 0, unplacedTiles[0], 0);
    (unit.hasTile(0, 0)).should.equal(true);
    (unit.getNumberOfTiles()).should.equal(1);

    canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], 0);
    (canPlaceFirstTileAtOrigo).should.equal(false);

    var possiblePositions = unit.getPossiblePositions();
    (possiblePositions.length).should.equal(4);
    var foundPosition1 = possiblePositions.some(function(position) {
        return (position.x == 1 && position.y === 0);
    });
    (foundPosition1).should.equal(true);
    var foundPosition2 = possiblePositions.some(function(position) {
        return (position.x == -1 && position.y === 0);
    });
    (foundPosition2).should.equal(true);
    var foundPosition3 = possiblePositions.some(function(position) {
        return (position.x === 0 && position.y == 1);
    });
    (foundPosition3).should.equal(true);
    var foundPosition4 = possiblePositions.some(function(position) {
        return (position.x === 0 && position.y == -1);
    });
    (foundPosition4).should.equal(true);
    var foundPosition5 = possiblePositions.some(function(position) {
        return (position.x == -1 && position.y == -1);
    });
    (foundPosition5).should.equal(false);
  });

  it("Can get possible positions for specific tile", function() {
    var unit = new Board();

    var crossRoadsTile = BaseGame.Tiles.TileTypes.crossroads();
    var possiblePositions = unit.getPossiblePlacementsForTile(crossRoadsTile);
    (possiblePositions.length).should.equal(1);
    var foundPosition1 = possiblePositions.some(function(position) {
      return (position.x === 0 && position.y === 0);
    });
    (foundPosition1).should.equal(true);

    unit.placeTile(0, 0, crossRoadsTile, 0);

    var northWestRoadTile = BaseGame.Tiles.TileTypes.westNorthRoad();
    possiblePositions = unit.getPossiblePlacementsForTile(northWestRoadTile);
    (possiblePositions.length).should.equal(2);
    var foundPosition2 = possiblePositions.some(function(position) {
      return (position.x == 1 && position.y === 0);
    });
    (foundPosition2).should.equal(true);
    var foundPosition3 = possiblePositions.some(function(position) {
      return (position.x === 0 && position.y == -1);
    });
    (foundPosition3).should.equal(true);
  });

});