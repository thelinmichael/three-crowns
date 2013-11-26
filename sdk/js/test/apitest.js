var assert = require('assert');
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

  afterEach(function(done) {
    socket.disconnect();
    done();
  });

  after(function() {
    server.stop();
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

  it("should extend listening functionality for the socket", function(done) {
    api.on('pong', function(pong) {
      should.exist(pong);
      should.exist(pong.message);
      "pong!".should.equal(pong.message);
      done();
    });
    api.ping();
  });

  it("should get socket from the sdk", function() {
    var socket = api.getSocket();
    should.exist(socket);
  });

  it("only passing hostname should create socket", function(done) {
    var api = new Api("http://localhost:8090");
    api.connect(function() {
      done();
    });
  });

  it("can create games", function(done) {
    api.numberOfGames(function(firstNumberOfGames) {
      api.createGame({}, function() {
        api.numberOfGames(function(secondNumberOfGames) {
          (secondNumberOfGames).should.equal(firstNumberOfGames + 1);
          done();
        });
      });
    });
  });

  it("can get server status", function(done) {
    api.getServerStatus(function(status) {
      should.exist(status.games);
      should.exist(status.numberOfGames);
      done();
    });
  });

});