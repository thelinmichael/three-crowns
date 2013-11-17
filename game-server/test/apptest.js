var assert = require('assert');

/* Start the Express server */
var app = require('../libs/app');

var io = require('socket.io-client');
var socket;

describe("Websocket API", function() {

  this.timeout(5000);

  var options = {
    'force new connection' : true
  };

  beforeEach(function(done) {
    socket = io.connect('http://localhost:8090', options);
    socket.on('connect', function(data) {
      done();
    });
  });

  it("should be able to connect", function() {
    if (!(socket && socket.connected)) {
      assert.fail("Could not connect");
    }
  });

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

});