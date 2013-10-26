var mongoose = require("mongoose");
var Tile = require("../models/tile");
var should = require("should");

describe('Tile', function() {

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

  it("edgetypes should exist", function() {
    should.exist(Tile.EdgeTypes);
    should.exist(Tile.EdgeTypes.GRASS);
    should.exist(Tile.EdgeTypes.ROAD);
    should.exist(Tile.EdgeTypes.CASTLE);
  });

  it("a tile can be instantiated with four edges", function() {
    var unit = new Tile({ "edges" : [ Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.GRASS] });
    var edges = unit.getEdges();
    should.exist(edges);
    edges.length.should.equal(4);
    edges[0].should.equal(Tile.EdgeTypes.ROAD);
    edges[1].should.equal(Tile.EdgeTypes.GRASS);
    edges[2].should.equal(Tile.EdgeTypes.CASTLE);
    edges[3].should.equal(Tile.EdgeTypes.GRASS);
  });
});