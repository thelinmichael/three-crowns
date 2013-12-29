var assert = require('assert');
var should = require('should');

var Tile = require("../../libs/models/tile");
var Directions = require("../../libs/models/tile").Directions;
var BasePack = require("../../libs/gamepacks/basegame/main");

describe("Tile", function() {

  it("Should return the correct border (north, east, south, west) given a direction", function() {

    var uniqueSidesTile = require("../fixtures/test-gamepack/tiles/every-side-is-unique");

    var northernBorder = uniqueSidesTile.getBorders(Directions.NORTH);
    northernBorder.length.should.equal(3);
    northernBorder[0].getName().should.equal("Grass");
    northernBorder[1].getName().should.equal("Road");
    northernBorder[2].getName().should.equal("Grass");

    var easternBorder = uniqueSidesTile.getBorders(Directions.EAST);
    easternBorder.length.should.equal(3);
    easternBorder[0].getName().should.equal("Grass");
    easternBorder[1].getName().should.equal("Grass");
    easternBorder[2].getName().should.equal("Grass");

    var southernBorder = uniqueSidesTile.getBorders(Directions.SOUTH);
    southernBorder.length.should.equal(3);
    southernBorder[0].getName().should.equal("Grass");
    southernBorder[1].getName().should.equal("River");
    southernBorder[2].getName().should.equal("Grass");

    var westernBorder = uniqueSidesTile.getBorders(Directions.WEST);
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

});