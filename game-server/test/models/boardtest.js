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

    var noTile = unit.getTileAt(0,0);
    should.not.exist(noTile);

    var wasPlaced = unit.placeTile(0, 0, tile);
    wasPlaced.should.equal(true);

    var fetchedTile = unit.getTileAt(0,0);
    should.exist(fetchedTile);
    fetchedTile.should.equal(tile);
  });

  it("should not be able to place a tile on the same coordinate as an existing tile", function() {
    var unit = new Board({ "tiles" : {} });
    var tile1 = new Tile({ "edges" : [ Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS ]});
    var tile2 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS ]});

    var wasPlaced = unit.placeTile(0,0, tile1);
    wasPlaced.should.equal(true);
    var placedTile = unit.getTileAt(0,0);
    should.exist(placedTile);
    placedTile.should.equal(tile1);

    wasPlaced = unit.placeTile(0,0, tile2);
    wasPlaced.should.equal(false);
    var placedTile = unit.getTileAt(0,0);
    should.exist(placedTile);
    placedTile.should.equal(tile1);
  });

  it("should be able to place several tiles next to eachother", function() {
    var unit = new Board({ "tiles" : {} });

    var tile1 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS ]});
    var tile2 = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS ]});

    unit.getNumberOfTiles().should.equal(0);
    var wasPlaced = unit.placeTile(0,0,tile1);
    wasPlaced.should.equal(true);
    unit.getNumberOfTiles().should.equal(1);

    wasPlaced = unit.placeTile(0,5,tile2);
    wasPlaced.should.equal(false);
    unit.getNumberOfTiles().should.equal(1);

    wasPlaced = unit.placeTile(0,1,tile2);
    wasPlaced.should.equal(true);
    unit.getNumberOfTiles().should.equal(2);
  });

  it("should be able to place a meeple on a tile");

});