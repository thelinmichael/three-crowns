var assert = require('assert');
var should = require('should');

var Board = require('../../libs/models/board');

var GamepackLoader = require("../../libs/gamepackloader");
var Rotations = require("../../libs/tile-rotations");
var Directions = require("../../libs/directions");

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

  it("Uses rotation to get a valid position for a tile", function() {
    var unit = new Board();
    var straightRoad = require("../../libs/gamepacks/basegame/tiles/u-straight-road");
    unit.placeTile(0, 0, straightRoad, Rotations.NONE);

    var curvedRoad = require("../../libs/gamepacks/basegame/tiles/v-curved-road");
    curvedRoad.tilesMatch(Rotations.NONE, unit.getTile(0, 0), Directions.WEST);
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

    unit.placeTile(0, 0, straightRoad, Rotations.NONE);

    var curvedRoad = require("../../libs/gamepacks/basegame/tiles/v-curved-road");
    possiblePositions = unit.getPossiblePlacementsForTile(curvedRoad);
    possiblePositions.length.should.equal(4);
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

    unit.placeTile(0, 0, halfCircleCastleWithRoad, Rotations.NONE);

    var straightRoad = require("../../libs/gamepacks/basegame/tiles/u-straight-road");

    straightRoad.tilesMatch(Rotations.ONCE, unit.getTile(0, 0), Directions.NORTH).should.equal(true);

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

  it("should keep track of how long a road is that spans across several tiles", function() {
    var unit = new Board();

    var crossroads = require("../../libs/gamepacks/basegame/tiles/x-crossroads");
    var threeWayCrossroad = require("../../libs/gamepacks/basegame/tiles/w-three-way-crossroad");

    unit.placeTile(0, 0, crossroads, Rotations.NONE);
    unit.placeTile(1, 0, threeWayCrossroad, Rotations.ONCE);

    var placedTile = unit.getTile(1, 0).tile;
    var roadConstruction = placedTile.getConnectableAreaAtPosition(7);

    var tilesAndPositionsInvolvedInConstruction = unit.getTileAreasCoveredByConnectableArea(1, 0, roadConstruction);
    should.exist(tilesAndPositionsInvolvedInConstruction);
    tilesAndPositionsInvolvedInConstruction.length.should.equal(2);
  });

});