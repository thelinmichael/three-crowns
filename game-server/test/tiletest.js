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
});