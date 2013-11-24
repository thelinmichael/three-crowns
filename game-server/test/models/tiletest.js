var mongoose = require("mongoose");
var Tile = require("../../libs/models/tile");
var should = require("should");

describe('Tile', function() {

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

  it("should have edgetypes", function() {
    should.exist(Tile.EdgeTypes);
    should.exist(Tile.EdgeTypes.GRASS);
    should.exist(Tile.EdgeTypes.ROAD);
    should.exist(Tile.EdgeTypes.CASTLE);
  });

  it("should be created with four edges", function() {
    var unit = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.GRASS } });
    var edges = unit.getEdges();
    should.exist(edges);
    edges.north.should.equal(Tile.EdgeTypes.ROAD);
    edges.east.should.equal(Tile.EdgeTypes.GRASS);
    edges.south.should.equal(Tile.EdgeTypes.CASTLE);
    edges.west.should.equal(Tile.EdgeTypes.GRASS);
  });

  it("should be able to compare tiles even if rotated", function() {
    var unit = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.GRASS } });

    var identicalTileButRotated = new Tile({ "edges" : { "east" : Tile.EdgeTypes.ROAD, "south" : Tile.EdgeTypes.GRASS, "west" : Tile.EdgeTypes.CASTLE, "north" : Tile.EdgeTypes.GRASS } });
    var differentTile = new Tile({ "edges" : { "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.GRASS, "west" : Tile.EdgeTypes.CASTLE, "north" : Tile.EdgeTypes.GRASS } });

    var isSameTile = unit.sameAs(identicalTileButRotated);
    isSameTile.should.equal(true);

    var isNotSameTile = unit.sameAs(differentTile);
    isNotSameTile.should.equal(false);
  });

});