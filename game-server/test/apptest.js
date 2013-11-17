var assert = require('assert');
var mongoose = require("mongoose");

/* Start the Express server */
var app = require('../libs/app');

var io = require('socket.io-client');
var socket;

describe("Websocket API", function() {

  beforeEach(function(done) {
    socket = io.connect('http://localhost:8090', { 'force new connection' : true });
    socket.on('connect', function(data) {
      done();
    });
  });

  this.timeout(5000);

  it("should be able to connect", function() {
    if (!(socket && socket.socket && socket.socket.connected)) {
      assert.fail("Could not connect");
    }
  });

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

});