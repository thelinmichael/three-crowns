var mongoose = require("mongoose");
var Tile = require("../../libs/models/tile");
var Fixtures = require("../fixtures/fixtures");
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

  it("can get a tiles borders when rotated", function() {
    var unit = Fixtures.Tiles.westNorthCorner();
    var northernBorder = unit.getNorthernBorder(0); // No rotation

    (Tile.EdgeTypes.GRASS).should.equal(northernBorder[0]);
    (Tile.EdgeTypes.ROAD).should.equal(northernBorder[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorder[2]);

    var northernBorderAfterOneRotation = unit.getNorthernBorder(1);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterOneRotation[0]);
    (Tile.EdgeTypes.ROAD).should.equal(northernBorderAfterOneRotation[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterOneRotation[2]);

    var northernBorderAfterTwoRotations = unit.getNorthernBorder(2);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterTwoRotations[0]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterTwoRotations[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterTwoRotations[2]);

    var northernBorderAfterThreeRotations = unit.getNorthernBorder(3);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterThreeRotations[0]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterThreeRotations[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterThreeRotations[2]);

    var northernBorderAfterFourRotations = unit.getNorthernBorder(4);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterFourRotations[0]);
    (Tile.EdgeTypes.ROAD).should.equal(northernBorderAfterFourRotations[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorderAfterFourRotations[2]);
  });

  it("can set a tiles borders specified after sides", function() {
    var unit = Fixtures.Tiles.westNorthCorner();
    var northernBorder = unit.getNorthernBorder(0);
    var easternBorder = unit.getEasternBorder(0);

    (Tile.EdgeTypes.GRASS).should.equal(northernBorder[0]);
    (Tile.EdgeTypes.ROAD).should.equal(northernBorder[1]);
    (Tile.EdgeTypes.GRASS).should.equal(northernBorder[2]);

    (Tile.EdgeTypes.GRASS).should.equal(easternBorder[0]);
    (Tile.EdgeTypes.GRASS).should.equal(easternBorder[1]);
    (Tile.EdgeTypes.GRASS).should.equal(easternBorder[2]);

    unit.setNorthernBorder([ Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE, Tile.EdgeTypes.CASTLE ]);
    var northernBorderAfterChange = unit.getNorthernBorder(0);
    var easternBorderAfterChange = unit.getEasternBorder(0);

    (Tile.EdgeTypes.CASTLE).should.equal(northernBorderAfterChange[0]);
    (Tile.EdgeTypes.CASTLE).should.equal(northernBorderAfterChange[1]);
    (Tile.EdgeTypes.CASTLE).should.equal(northernBorderAfterChange[2]);

    (Tile.EdgeTypes.GRASS).should.equal(easternBorderAfterChange[0]);
    (Tile.EdgeTypes.GRASS).should.equal(easternBorderAfterChange[1]);
    (Tile.EdgeTypes.GRASS).should.equal(easternBorderAfterChange[2]);
  });

  it("should modify its borders if rotated", function() {
    var unit = Fixtures.Tiles.westNorthCorner();
    var originalTileBorders = unit.getBorders();

    unit.rotate(0);

    var tileBordersNoRotation = unit.getBorders();
    (tileBordersNoRotation).should.equal(originalTileBorders);

    unit.rotate(1);

    var tileBordersOneRotation = unit.getBorders();
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[0]);
    (Tile.EdgeTypes.ROAD).should.equal(tileBordersOneRotation[1]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[2]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[3]);
    (Tile.EdgeTypes.ROAD).should.equal(tileBordersOneRotation[4]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[5]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[6]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[7]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[8]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[9]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[10]);
    (Tile.EdgeTypes.GRASS).should.equal(tileBordersOneRotation[11]);
  });

  it("should be able to compare tile components", function() {
    // Border components differ
    var tile1 = Fixtures.Tiles.westNorthCorner();
    var tile2 = Fixtures.Tiles.westNorthCorner();
    var tile3 = Fixtures.Tiles.crossroads();

    var areTheSameTile = tile1.sameAs(tile2);
    (areTheSameTile).should.equal(true);

    var areNotTheSameTile = tile1.sameAs(tile3);
    (areNotTheSameTile).should.equal(false);

    // Same tile but rotations differ
    tile1.rotate(2);

    var areStillTheSameTile = tile1.sameAs(tile2);
    (areStillTheSameTile).should.equal(true);

    var areStillNotTheSameTile = tile1.sameAs(tile3);
    (areStillNotTheSameTile).should.equal(false);

    // Internal component differs
    var tile4 = Fixtures.Tiles.allGrass();
    var tile5 = Fixtures.Tiles.grassCathedral();
    var tile6 = Fixtures.Tiles.grassCathedral();
    ((tile4).sameAs(tile5)).should.equal(false);
    ((tile5).sameAs(tile6)).should.equal(true);
  });

  it("should be able to tell where a meeple can be placed on a tile", function() {
    var tile1 = Fixtures.Tiles.westNorthCorner();
    (tile1.getMeeplePlacements().length).should.equal(3);
  });

});