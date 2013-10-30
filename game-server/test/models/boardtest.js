var mongoose = require("mongoose");
var Board = require("../../lib/models/board");
var Tile = require("../../lib/models/tile");
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
    var tile1 = new Tile({ "edges" : [ Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS ]});
    var tile2 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS ]});

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

  it("should be able to place several tiles next to eachother", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS ]});
    var tile2 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS ]});
    var tile3 = new Tile({ "edges" : [ Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.GRASS ]});

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
    var noTile = unit.getTile(0, 2);
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
});