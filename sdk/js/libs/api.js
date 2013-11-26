var io = require('socket.io-client');

function GameServer(hostOrSocket) {
  if ("string" === (typeof hostOrSocket)) {
    this.host = hostOrSocket;
  } else {
    this.socket = hostOrSocket;
  }
}

GameServer.prototype.getSocket = function() {
  return this.socket;
};

GameServer.prototype.on = function(eventType, callback) {
  this.socket.on(eventType, callback);
};

GameServer.prototype.connect = function(callback) {
  this.socket = io.connect(this.host, { 'force new connection' : true });
  this.socket.once('connect', function() {
    callback();
  });
};

GameServer.prototype.ping = function(callback) {
  this.socket.emit('ping');
  if (callback) {
    this.socket.once('pong', function(pong) {
      callback(pong);
    });
  }
};

GameServer.prototype.numberOfGames = function(callback) {
  this.socket.emit('server-status');
  this.socket.once('server-status', function(status) {
    callback(status.numberOfGames);
  });
};

GameServer.prototype.createGame = function(options, callback) {
  this.socket.emit('create', options);
  this.socket.once('create', function(status) {
    callback(status);
  });
};

GameServer.prototype.getServerStatus = function(callback) {
  this.socket.emit('server-status');
  if (callback) {
    this.socket.once('server-status', function(status) {
      callback(status);
    });
  }
};

exports = module.exports = GameServer;