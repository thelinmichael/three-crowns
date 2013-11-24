var assert = require('assert');
var mongoose = require("mongoose");
var io = require('socket.io-client');
var should = require('should');

var Api = require('../libs/api');
var api;

var Server = require('threecrowns-gameserver');
var server = new Server();

var socket;

describe("Websocket API", function() {

  this.timeout(5000);

  before(function() {
    server.start(null, 8090, { log : false});
  });

  beforeEach(function(done) {
    socket = io.connect('http://localhost:8090', { 'force new connection' : true });
    api = new Api(socket);
    socket.on('connect', function(data) {
      done();
    });
  });

  it("should be able to connect", function() {
    if (!(socket && socket.socket && socket.socket.connected)) {
      assert.fail("Could not connect");
    }
  });

  it("should be able to ping server", function(done) {
    api.ping(function(pong) {
      should.exist(pong);
      should.exist(pong.message);
      "pong!".should.equal(pong.message);
      done();
    });
  });

  it("should get number of games", function(done) {
    api.numberOfGames(function(numberOfGames) {
      (numberOfGames).should.equal(0);
      done();
    });
  });

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

  after(function() {
    server.stop();
  });

});