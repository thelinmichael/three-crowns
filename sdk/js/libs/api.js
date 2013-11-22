function GameServer(socket) {
  this.socket = socket;
}

GameServer.prototype.ping = function(callback) {
  this.socket.emit('ping');
  this.socket.on('pong', function(pong) {
    callback(pong);
  });
};

GameServer.prototype.numberOfGames = function(callback) {
  this.socket.emit('server-status');
  this.socket.on('server-status', function(status) {
    callback(status.numberOfGames);
  });
};

exports = module.exports = GameServer;