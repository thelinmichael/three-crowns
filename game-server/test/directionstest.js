var Directions = require("../libs/directions");
var Rotations = require("../libs/tile-rotations");

describe("Directions", function() {

  it("should rotate a directions clockwise", function() {
    var unit = Directions.NORTH;

    var rotated = Directions.rotateClockwise(unit, Rotations.ONCE);
    rotated.should.equal(Directions.EAST);
  });

  it("should rotate a direction counter clockwise", function() {
    var unit = Directions.NORTH;

    var rotated = Directions.rotateCounterClockwise(unit, Rotations.ONCE);
    rotated.should.equal(Directions.WEST);
  });

  it("should rotate an array of directions clockwise", function() {
    var unit = [Directions.NORTH, Directions.EAST];

    var rotated = Directions.rotateClockwise(unit, Rotations.TWICE);
    rotated.length.should.equal(2);
    rotated[0].should.equal(Directions.SOUTH);
    rotated[1].should.equal(Directions.WEST);
  });

  it("should rotate an array of directions counterclockwise", function() {
    var unit = [Directions.NORTH, Directions.EAST];

    var rotated = Directions.rotateClockwise(unit, Rotations.TWICE);
    rotated.length.should.equal(2);
    rotated[0].should.equal(Directions.SOUTH);
    rotated[1].should.equal(Directions.WEST);
  });

});