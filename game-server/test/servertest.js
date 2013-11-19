var assert = require('assert');
var mongoose = require("mongoose");
var io = require('socket.io-client');

var GameServer = require('../libs/server');
var server = new GameServer();

var socket;

describe("Websocket API", function() {

  before(function() {
    server.start(null, 8090, { log : false});
  });

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

  after(function() {
    server.stop();
  });

});