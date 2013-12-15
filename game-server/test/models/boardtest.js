var mongoose = require("mongoose");
var Board = require("../../libs/models/board");
var Tile = require("../../libs/models/tile");
var Fixtures = require("../fixtures/fixtures");
var should = require("should");
var assert = require("assert");

describe('Board', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/game', done);
  });

  beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

  it("should be able to place a tile on an empty board", function() {
    var unit = new Board({ "tiles" : [] });
    should.exist(unit);
    var tiles = unit.getTiles();
    should.exist(tiles);

    unit.getNumberOfTiles().should.equal(0);

    var tile = Fixtures.generateCrossroadsTile();

    var noTile = unit.getTile(0, 0);
    should.not.exist(noTile);

    (function() {
      unit.placeTile(0, 0, tile, 0);
    }).should.not.throw();

    unit.getTiles().length.should.equal(1);
    var placedTile = unit.getTile(0, 0);
    should.exist(placedTile);
    placedTile.should.equal(tile);
  });

  it("should be able to check if there's a tile placed at a specific coordinate", function() {
    var unit = new Board({ "tiles" : {} });

    var tile = Fixtures.generateCrossroadsTile();

    var emptyCoordinate = unit.hasTile(0, 0);
    should.exist(emptyCoordinate);
    emptyCoordinate.should.equal(false);

    unit.placeTile(0, 0, tile, 0, 0);
    var takenCoordinate = unit.hasTile(0, 0);
    should.exist(takenCoordinate);
    takenCoordinate.should.equal(true);
  });

  it("should not be able to place a tile on the same coordinate as an existing tile", function() {
    var unit = new Board({ "tiles" : {} });
    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateCrossroadsTile();

    unit.placeTile(0, 0, tile1, 0);
    var placedTile = unit.getTile(0, 0);
    should.exist(placedTile);
    placedTile.should.equal(tile1);

    (function() {
      unit.placeTile(0, 0, tile2, 0);
    }).should.throw();

    var placedTile_secondCheck = unit.getTile(0,0);
    should.exist(placedTile_secondCheck);
    placedTile.should.equal(tile1);
  });

  it("should not be able to place a tile unless it is adjacent to another tile", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateCrossroadsTile();
    var tile3 = Fixtures.generateCrossroadsTile();

    unit.getNumberOfTiles().should.equal(0);
    unit.placeTile(0, 0, tile1, 0);
    unit.getNumberOfTiles().should.equal(1);
    var firstPlacedTile = unit.getTile(0, 0);
    tile1.should.equal(firstPlacedTile);

    /* Two steps east of first tile -- Cannot place it there */
    (function() {
      unit.placeTile(2, 0, tile2, 0);
    }).should.throw();
    unit.getNumberOfTiles().should.equal(1);
    var noTile = unit.getTile(2, 0);
    should.not.exist(noTile);

    /* One step east of tile -- Can be placed there */
    unit.placeTile(1, 0, tile2, 0);
    unit.getNumberOfTiles().should.equal(2);
    var secondPlacedTile = unit.getTile(1, 0);
    tile2.should.equal(secondPlacedTile);

    /* Two steps east of tile -- Can now be placed there */
    unit.placeTile(2, 0, tile3, 0);
    unit.getNumberOfTiles().should.equal(3);
    var thirdPlacedTile = unit.getTile(2, 0);
    tile3.should.equal(thirdPlacedTile);
  });

  it("should only be able to place a tile if adjacent tiles have matching edges", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateWestNorthCorner();

    unit.placeTile(0, 0, tile1, 0);

    // Edges do not match
    (function() {
      unit.placeTile(-1, 0, tile2, 0);
    }).should.throw();

    // Edges match (ROAD and ROAD)
    (function() {
      unit.placeTile(1, 0, tile2, 0);
    }).should.not.throw();

    var firstPlacedTile = unit.getTile(0, 0);
    should.exist(firstPlacedTile);
    firstPlacedTile.should.equal(tile1);

    var secondPlacedTile = unit.getTile(1, 0);
    should.exist(secondPlacedTile);
    secondPlacedTile.should.equal(tile2);

    unit.getNumberOfTiles().should.equal(2);

    var noTile = unit.getTile(-1, 0);
    should.not.exist(noTile);
  });

  it("should be able to test if a tile can be placed by rotating it without placing it", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateWestNorthCorner();

    unit.placeTile(0, 0, tile1, 0);

    unit.canPlaceTile(0, 1, tile2, 0).should.equal(false);
    unit.canPlaceTile(0, 1, tile2, 1).should.equal(false);
    unit.canPlaceTile(0, 1, tile2, 2).should.equal(true);
    unit.canPlaceTile(0, 1, tile2, 3).should.equal(true);
    unit.canPlaceTile(0, 1, tile2, 4).should.equal(false);
    unit.canPlaceTile(0, 1, tile2, 5).should.equal(false);
  });

  it("should be possible to place a tile with rotation", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = Fixtures.generateCrossroadsTile();
    var tile2 = Fixtures.generateWestNorthCorner();

    unit.placeTile(0, 0, tile1, 0);

    (function() {
      unit.placeTile(0, 1, tile2, 0);
    }).should.throw();

    (function() {
      unit.placeTile(0, 1, tile2, 2, 0);
    }).should.not.throw();

    unit.hasTile(0, 1).should.equal(true);
    var placedTile = unit.getTile(0, 1);

    should.exist(placedTile);
    placedTile.sameAs(tile2).should.equal(true);
  });

});