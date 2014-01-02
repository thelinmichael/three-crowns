var should = require("should");
var assert = require("assert");

var Directions = require("../libs/directions");
var Connectable = require("../libs/models/tile-connectable-area");
var Grass = require("../libs/gamepacks/basegame/tile-area-types/grass");
var Road = require("../libs/gamepacks/basegame/tile-area-types/road");

describe("Connectable area", function() {

  it("should know that a connectable area is not a cul de sac if its positions face more than one direction of the tile", function() {

    var unit = new Connectable({
      "positions" : [ 8,9 ],
      "areaType" : Grass
    });

    var isCulDeSac = unit.isCulDeSac();
    should.exist(isCulDeSac);
    isCulDeSac.should.equal(false);

  });

  it("should know that a connectable area is a cul de sac if its positions face more than one direction of the tile", function() {

    var unit = new Connectable({
      "positions" : [ 0,1,2 ],
      "areaType" : Grass
    });

    var isCulDeSac = unit.isCulDeSac();
    should.exist(isCulDeSac);
    isCulDeSac.should.equal(true);

  });

  it("should know that a connectable with grass connecting to the north is only connecting that way", function() {
    var unit = new Connectable({
      "positions" : [ 0,1,2 ],
      "areaType" : Grass
    });

    var directions = unit.getFacingDirections();
    should.exist(directions);
    directions.length.should.equal(1);
    directions[0].should.equal(Directions.NORTH);
  });

  it("should know that a curved road is connecting in two directions", function() {
    var unit = new Connectable({
      "positions" : [ 7,10 ],
      "areaType" : Road
    });

    var directions = unit.getFacingDirections();
    should.exist(directions);
    directions.length.should.equal(2);
    directions[0].should.equal(Directions.SOUTH);
    directions[1].should.equal(Directions.WEST);
  });

});