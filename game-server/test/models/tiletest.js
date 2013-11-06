var mongoose = require("mongoose");
var Tile = require("../../lib/models/tile");
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

  it("should have edgetypes", function() {
    should.exist(Tile.EdgeTypes);
    should.exist(Tile.EdgeTypes.GRASS);
    should.exist(Tile.EdgeTypes.ROAD);
    should.exist(Tile.EdgeTypes.CASTLE);
  });

  it("a tile can be instantiated with four edges", function() {
    var unit = new Tile({ "edges" : { "north" : Tile.EdgeTypes.ROAD, "east" : Tile.EdgeTypes.GRASS, "south" : Tile.EdgeTypes.CASTLE, "west" : Tile.EdgeTypes.GRASS } });
    var edges = unit.getEdges();
    should.exist(edges);
    edges["north"].should.equal(Tile.EdgeTypes.ROAD);
    edges["east"].should.equal(Tile.EdgeTypes.GRASS);
    edges["south"].should.equal(Tile.EdgeTypes.CASTLE);
    edges["west"].should.equal(Tile.EdgeTypes.GRASS);
  });
});