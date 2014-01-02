var assert = require('assert');
var should = require('should');

var Directions = require("../../libs/directions");
var Rotations = require("../../libs/tile-rotations");
var Positions = require("../../libs/tile-positions");

describe("Tile", function() {

  it("should be able to rotate specific positions", function() {
    var rotatedPositions1 = Positions.rotate([0,1,2], Rotations.THRICE);
    rotatedPositions1[0].should.equal(9);
    rotatedPositions1[1].should.equal(10);
    rotatedPositions1[2].should.equal(11);

    var rotatedPositions2 = Positions.rotate([8,9,10], Rotations.TWICE);
    rotatedPositions2[0].should.equal(2);
    rotatedPositions2[1].should.equal(3);
    rotatedPositions2[2].should.equal(4);
  });

  it("should give the opposite to a given position", function() {
    Positions.oppositeOf(0).should.equal(8);
    Positions.oppositeOf(8).should.equal(0);
    Positions.oppositeOf(3).should.equal(11);
    Positions.oppositeOf(9).should.equal(5);
  });


  it("should rotate positions counter-clockwise", function() {
    var rotatedPositions1 = Positions.counterRotate([9,10,11], Rotations.THRICE);
    rotatedPositions1[0].should.equal(0);
    rotatedPositions1[1].should.equal(1);
    rotatedPositions1[2].should.equal(2);

    var rotatedPositions2 = Positions.counterRotate([2,3,4], Rotations.TWICE);
    rotatedPositions2[0].should.equal(8);
    rotatedPositions2[1].should.equal(9);
    rotatedPositions2[2].should.equal(10);
  });

});