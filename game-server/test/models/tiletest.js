var assert = require('assert');
var should = require('should');

var Tile = require("../../libs/models/tile");
var Directions = require("../../libs/models/tile").Directions;
var Rotations = require("../../libs/models/tile").Rotations;
var Positions = require("../../libs/models/tile").Positions;

describe("Tile", function() {

  it("Should return the correct border (north, east, south, west) given a direction", function() {

    var uniqueSidesTile = require("../fixtures/test-gamepack/tiles/every-side-is-unique");

    var northernBorder = uniqueSidesTile.getBorderTypesInDirection(Directions.NORTH);
    northernBorder.length.should.equal(3);
    northernBorder[0].getName().should.equal("Grass");
    northernBorder[1].getName().should.equal("Road");
    northernBorder[2].getName().should.equal("Grass");

    var easternBorder = uniqueSidesTile.getBorderTypesInDirection(Directions.EAST);
    easternBorder.length.should.equal(3);
    easternBorder[0].getName().should.equal("Grass");
    easternBorder[1].getName().should.equal("Grass");
    easternBorder[2].getName().should.equal("Grass");

    var southernBorder = uniqueSidesTile.getBorderTypesInDirection(Directions.SOUTH);
    southernBorder.length.should.equal(3);
    southernBorder[0].getName().should.equal("Grass");
    southernBorder[1].getName().should.equal("River");
    southernBorder[2].getName().should.equal("Grass");

    var westernBorder = uniqueSidesTile.getBorderTypesInDirection(Directions.WEST);
    westernBorder.length.should.equal(3);
    westernBorder[0].getName().should.equal("Castle");
    westernBorder[1].getName().should.equal("Castle");
    westernBorder[2].getName().should.equal("Castle");
  });

it("Should rotate clock-wise", function() {
  Directions.rotateDirection(Directions.NORTH, 0).should.equal(Directions.NORTH);
  Directions.rotateDirection(Directions.NORTH, 1).should.equal(Directions.WEST);
  Directions.rotateDirection(Directions.NORTH, 2).should.equal(Directions.SOUTH);
  Directions.rotateDirection(Directions.NORTH, 3).should.equal(Directions.EAST);
});

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