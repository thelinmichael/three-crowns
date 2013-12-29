var assert = require('assert');
var should = require('should');

var Board = require('../../libs/models/board');

var BaseGame = require("../../libs/gamepacks/basegame/main");
var Rotations = require("../../libs/models/tile").Rotations;

describe("Board", function() {

  it("Should get the number of tiles placed on the board", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();

    unit.getNumberOfTiles().should.equal(0);
    unit.placeTile(0, 0, unplacedTiles[0], Rotations.NONE);

    unit.getNumberOfTiles().should.equal(1);
  });

  it("Can get positions on the board that are free and adjacent to another tiles", function() {
    var unit = new Board();
    var unplacedTiles = BaseGame.getTiles();
    should.exist(unplacedTiles);

    var canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], Rotations.NONE);
    (canPlaceFirstTileAtOrigo).should.equal(true);
    (unit.hasTile(0, 0)).should.equal(false);
    unit.placeTile(0, 0, unplacedTiles[0], Rotations.NONE);
    (unit.hasTile(0, 0)).should.equal(true);
    (unit.getNumberOfTiles()).should.equal(1);

    canPlaceFirstTileAtOrigo = unit.canPlaceTile(0, 0, unplacedTiles[0], Rotations.NONE);
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

    var westEastRoadTile = require("../../libs/gamepacks/basegame/tiles/westeast-road");
    var possiblePositions = unit.getPossiblePlacementsForTile(westEastRoadTile);
    (possiblePositions.length).should.equal(1);
    var foundPosition1 = possiblePositions.some(function(position) {
      return (position.x === 0 && position.y === 0);
    });
    (foundPosition1).should.equal(true);

    unit.placeTile(0, 0, westEastRoadTile, 0);

    var westNorthRoadTile = require("../../libs/gamepacks/basegame/tiles/westnorth-road");
    possiblePositions = unit.getPossiblePlacementsForTile(westNorthRoadTile);
    (possiblePositions.length).should.equal(4);
    var foundPosition2 = possiblePositions.some(function(position) {
      return (position.x == 1 && position.y === 0);
    });
    (foundPosition2).should.equal(true);
    var foundPosition3 = possiblePositions.some(function(position) {
      return (position.x === 0 && position.y == -1);
    });
    (foundPosition3).should.equal(true);
  });

  it("Should consider rotation when giving possible placements", function() {
    var unit = new Board();

    var halfCircleCastleWithRoad = require("../../libs/gamepacks/basegame/tiles/halfcircle-castle-with-road");
    var westEastRoad = require("../../libs/gamepacks/basegame/tiles/westeast-road");

    unit.placeTile(0, 0, halfCircleCastleWithRoad, Rotations.NONE);

    var possiblePositions = unit.getPossiblePlacementsForTile(westEastRoad);
    possiblePositions.length.should.equal(3);
    possiblePositions[0].x.should.equal(1);
    possiblePositions[0].y.should.equal(0);
    possiblePositions[0].rotations.length.should.equal(2);
    possiblePositions[0].rotations.indexOf(1).should.not.equal(-1);
    possiblePositions[0].rotations.indexOf(3).should.not.equal(-1);
    possiblePositions[1].x.should.equal(0);
    possiblePositions[1].y.should.equal(-1);
    possiblePositions[1].rotations.length.should.equal(2);
    possiblePositions[1].rotations.indexOf(1).should.not.equal(-1);
    possiblePositions[1].rotations.indexOf(3).should.not.equal(-1);
    possiblePositions[2].x.should.equal(0);
    possiblePositions[2].y.should.equal(1);
    possiblePositions[2].rotations.length.should.equal(2);
    possiblePositions[2].rotations.indexOf(1).should.not.equal(-1);
    possiblePositions[2].rotations.indexOf(3).should.not.equal(-1);
  });

  it("Should persist a placed tiles rotation", function() {
    var unit = new Board();

    var westEastRoad = require("../../libs/gamepacks/basegame/tiles/westeast-road");

    unit.placeTile(0, 0, westEastRoad, Rotations.ONCE);
    var placedTile = unit.getTile(0, 0);

    placedTile.rotation.should.equal(Rotations.ONCE);
  });

  it.only("Should keep track of how large a road is", function() {
    var unit = new Board();

    var crossroads1 = require("../../libs/gamepacks/basegame/tiles/crossroads");
    var crossroads2 = require("../../libs/gamepacks/basegame/tiles/crossroads");

    unit.placeTile(0, 0, crossroads1, Rotations.NONE);
    unit.placeTile(1, 0, crossroads2, Rotations.NONE);

    var placedTile = unit.getTile(1, 0).tile;
    var roadConstruction = placedTile.getBorderConstruction(10);

    should.exist(roadConstruction);
    roadConstruction.constructionType.getName().should.equal("Road");

    var tilesAndPositionsInvolvedInConstruction = unit.getSpanningConstructions(1, 0, roadConstruction);
    should.exist(tilesAndPositionsInvolvedInConstruction);
    tilesAndPositionsInvolvedInConstruction.length.should.equal(2);
  });

});