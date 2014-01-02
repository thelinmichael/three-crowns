var assert = require('assert');
var should = require('should');

var Board = require('../libs/models/board');
var Rotations = require('../libs/tile-rotations');

var unit = require('../libs/board-traverser');

describe("BoardTraverser", function() {

  it("should keep track of how many open connections a road has", function() {
    var board = new Board();

    var crossroads1 = require("../libs/gamepacks/basegame/tiles/x-crossroads");
    var curvedRoad = require("../libs/gamepacks/basegame/tiles/v-curved-road");
    var crossroads2 = require("../libs/gamepacks/basegame/tiles/x-crossroads");

    board.placeTile(0, 0, crossroads1, Rotations.NONE);

    var southernRoad = crossroads1.getConnectableAreaAtPosition(7);

    var openConnections = unit.getOpenConnections(0, 0, southernRoad, board);
    should.exist(openConnections);
    openConnections.length.should.equal(1);

    board.placeTile(0, -1, curvedRoad, Rotations.ONCE);

    var openConnections2 = unit.getOpenConnections(0, 0, southernRoad, board);
    should.exist(openConnections2);
    openConnections2.length.should.equal(1);

    var curvedRoadArea = curvedRoad.getConnectableAreaAtPosition(7);

    var openConnections3 = unit.getOpenConnections(0, -1, curvedRoadArea, board);
    should.exist(openConnections3);
    openConnections3.length.should.equal(1);

    board.placeTile(-1,-1, crossroads2, Rotations.THRICE);

    var openConnections4 = unit.getOpenConnections(0, -1, curvedRoadArea, board);
    should.exist(openConnections4);
    openConnections4.length.should.equal(0);
  });

});

