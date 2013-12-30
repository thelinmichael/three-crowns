var assert = require('assert');
var should = require('should');

var Board = require('../../libs/models/board');

var GamepackLoader = require("../../libs/gamepackloader");
var Rotations = require("../../libs/models/tile").Rotations;

describe("Board", function() {

  it("Should get the number of tiles placed on the board", function() {
    var unit = new Board();

    var BaseGame = GamepackLoader.loadPack("basegame");

    var unplacedTiles = BaseGame.tiles;

    unit.getNumberOfTiles().should.equal(0);
    unit.placeTile(0, 0, unplacedTiles[0], Rotations.NONE);

    unit.getNumberOfTiles().should.equal(1);
  });

  it("Can get positions on the board that are free and adjacent to another tiles", function() {
    var unit = new Board();
    var BaseGame = GamepackLoader.loadPack("basegame");
    var unplacedTiles = BaseGame.tiles;
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

    var straightRoad = require("../../libs/gamepacks/basegame/tiles/u-straight-road");
    var possiblePositions = unit.getPossiblePlacementsForTile(straightRoad);
    (possiblePositions.length).should.equal(1);
    var foundPosition1 = possiblePositions.some(function(position) {
      return (position.x === 0 && position.y === 0);
    });
    (foundPosition1).should.equal(true);

    unit.placeTile(0, 0, straightRoad, 0);

    var curvedRoad = require("../../libs/gamepacks/basegame/tiles/v-curved-road");
    possiblePositions = unit.getPossiblePlacementsForTile(curvedRoad);
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

    var halfCircleCastleWithRoad = require("../../libs/gamepacks/basegame/tiles/d-halfcircle-castle-and-road");
    var straightRoad = require("../../libs/gamepacks/basegame/tiles/u-straight-road");

    unit.placeTile(0, 0, halfCircleCastleWithRoad, Rotations.NONE);

    var possiblePositions = unit.getPossiblePlacementsForTile(straightRoad);
    possiblePositions.length.should.equal(3);
    possiblePositions[0].rotations.length.should.equal(2);
    possiblePositions[1].rotations.length.should.equal(2);
    possiblePositions[2].rotations.length.should.equal(2);
  });

  it("Should persist a placed tiles rotation", function() {
    var unit = new Board();

    var straightRoad = require("../../libs/gamepacks/basegame/tiles/u-straight-road");

    unit.placeTile(0, 0, straightRoad, Rotations.ONCE);
    var placedTile = unit.getTile(0, 0);

    placedTile.rotation.should.equal(Rotations.ONCE);
  });

  it("Should keep track of how large a road is", function() {
    var unit = new Board();

    var crossroads = require("../../libs/gamepacks/basegame/tiles/x-crossroads");
    var threeWayCrossroad = require("../../libs/gamepacks/basegame/tiles/w-three-way-crossroad");

    unit.placeTile(0, 0, crossroads, Rotations.NONE);
    unit.placeTile(0, 1, threeWayCrossroad, Rotations.NONE);

    var placedTile = unit.getTile(0, 1).tile;
    var roadConstruction = placedTile.getBorderConstruction(7);

    should.exist(roadConstruction);
    roadConstruction.type.getName().should.equal("Road");

    var tilesAndPositionsInvolvedInConstruction = unit.getSpanningConstructions(0, 1, roadConstruction);
    should.exist(tilesAndPositionsInvolvedInConstruction);
    tilesAndPositionsInvolvedInConstruction.length.should.equal(2);
  });

});