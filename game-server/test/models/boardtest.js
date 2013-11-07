var mongoose = require("mongoose");
var Board = require("../../libs/models/board");
var Tile = require("../../libs/models/tile");
var should = require("should");
var assert = require("assert");

describe('Board', function() {

  before(function(done) {
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
  });

  beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

  it("should be able to place a tile on a board on an empty board", function() {
    var unit = new Board({ "tiles" : [] });
    should.exist(unit);
    var tiles = unit.getTiles();
    should.exist(tiles);

    unit.getNumberOfTiles().should.equal(0);

    var tile = new Tile({ "edges" : [ Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS ]});

    var noTile = unit.getTile(0, 0);
    should.not.exist(noTile);

    unit.placeTile(0, 0, tile);
    unit.getTiles().length.should.equal(1);
    var placedTile = unit.getTile(0, 0);
    should.exist(placedTile);
    placedTile.should.equal(tile);
  });

  it("should not be able to place a tile on the same coordinate as an existing tile", function() {
    var unit = new Board({ "tiles" : {} });
    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.GRASS, "west" : Tile.EdgeTypes.GRASS }});
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.GRASS, "west" : Tile.EdgeTypes.GRASS }});

    unit.placeTile(0, 0, tile1);
    var placedTile = unit.getTile(0, 0);
    should.exist(placedTile);
    placedTile.should.equal(tile1);

    (function() {
      unit.placeTile(0, 0, tile2);
    }).should.throw();

    var placedTile_secondCheck = unit.getTile(0,0);
    should.exist(placedTile_secondCheck);
    placedTile.should.equal(tile1);
  });

  it("should not be able to place a tile unless it is adjacent to another tile", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});
    var tile3 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.CASTLE, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.CASTLE }});

    unit.getNumberOfTiles().should.equal(0);
    unit.placeTile(0, 0, tile1);
    unit.getNumberOfTiles().should.equal(1);
    var firstPlacedTile = unit.getTile(0, 0);
    tile1.should.equal(firstPlacedTile);

    /* Two steps east of first tile -- Cannot place it there */
    (function() {
      unit.placeTile(2, 0, tile2);
    }).should.throw();
    unit.getNumberOfTiles().should.equal(1);
    var noTile = unit.getTile(2, 0);
    should.not.exist(noTile);

    /* One step east of tile -- Can be placed there */
    unit.placeTile(1, 0, tile2);
    unit.getNumberOfTiles().should.equal(2);
    var secondPlacedTile = unit.getTile(1, 0);
    tile2.should.equal(secondPlacedTile);

    /* Two steps east of tile -- Can now be placed there */
    unit.placeTile(2, 0, tile3);
    unit.getNumberOfTiles().should.equal(3);
    var thirdPlacedTile = unit.getTile(2, 0);
    tile3.should.equal(thirdPlacedTile);
  });

  it("should only be able to place a tile if adjacent tiles have matching edges", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.CASTLE, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});

    // Edges do not match (GRASS and CASTLE)
    unit.placeTile(0, 0, tile1);
    (function() {
      unit.placeTile(-1, 0, tile2);
    }).should.throw();

    // Edges match (GRASS and GRASS)
    (function() {
      unit.placeTile(1, 0, tile2);
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

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.ROAD }});

    unit.placeTile(0, 0, tile1);

    unit.canPlaceTile(0, 1, tile2).should.equal(false);
    tile2.edges.north.should.equal(Tile.EdgeTypes.GRASS);
    tile2.edges.west.should.equal(Tile.EdgeTypes.ROAD);
    unit.canPlaceTile(0, 1, tile2, 1).should.equal(true);
    tile2.edges.north.should.equal(Tile.EdgeTypes.GRASS);
    tile2.edges.west.should.equal(Tile.EdgeTypes.ROAD);

    unit.canPlaceTile(0, 1, tile2, 1).should.equal(true);
    unit.canPlaceTile(0, 1, tile2, 2).should.equal(false);
    unit.canPlaceTile(0, 1, tile2, 3).should.equal(true);
    unit.canPlaceTile(0, 1, tile2, 4).should.equal(false);
    unit.canPlaceTile(0, 1, tile2, 5).should.equal(true);
  });

  it("should be possible to place a tile with rotation", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});
    var tile2 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.GRASS, "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.ROAD }});

    unit.placeTile(0, 0, tile1);

    (function() {
      unit.placeTile(0, 1, tile2);
    }).should.throw();

    (function() {
      unit.placeTile(0, 1, tile2, 1);
    }).should.not.throw();

    unit.hasTile(0, 1).should.equal(true);
    var placedTile = unit.getTile(0, 1);

    should.exist(placedTile);
    placedTile.sameAs(tile2).should.equal(true);
  });

  it("should be able to check if there's a tile placed at a specific coordinate", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.ROAD, "west" : Tile.EdgeTypes.GRASS }});

    var emptyCoordinate = unit.hasTile(0, 0);
    should.exist(emptyCoordinate);
    emptyCoordinate.should.equal(false);

    unit.placeTile(0, 0, tile1);
    var takenCoordinate = unit.hasTile(0, 0);
    should.exist(takenCoordinate);
    takenCoordinate.should.equal(true);
  });

});