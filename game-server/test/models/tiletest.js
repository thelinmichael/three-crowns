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
    should.exist(Tile.EdgeTypes.CATHEDRAL);
  });

  it("should be created with 13 components, twelve borders and a optional internal", function() {
    var borders = [
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.ROAD, Tile.EdgeTypes.GRASS,       // North
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS,      // East
      Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE,   // South
      Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS, Tile.EdgeTypes.GRASS       // West
    ];
    var internal = Tile.EdgeTypes.CATHEDRAL;  // Middle of tile

    var unit = new Tile({ "components" : {
                            "borders" : borders,
                           "internal" : internal
                        }
    });

    var tileInternal = unit.getInternal();
    (Tile.EdgeTypes.CATHEDRAL).should.equal(tileInternal);

    var tileBorders = unit.getBorders();
    should.exist(tileBorders);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[0]);
    (Tile.EdgeTypes.ROAD).should.equal(tileBorders[1]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[2]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[3]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[4]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[5]);
    (Tile.EdgeTypes.CASTLE).should.equal(tileBorders[6]);
    (Tile.EdgeTypes.CASTLE).should.equal(tileBorders[7]);
    (Tile.EdgeTypes.CASTLE).should.equal(tileBorders[8]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[9]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[10]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBorders[11]);
  });

  it("should be able to compare tiles even if rotated");

});