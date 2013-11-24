function GameServer(socket) {
  this.socket = socket;
}

GameServer.prototype.ping = function(callback) {
  this.socket.emit('ping');
  this.socket.once('pong', function(pong) {
    callback(pong);
  });
};

GameServer.prototype.numberOfGames = function(callback) {
  this.socket.emit('server-status');
  this.socket.once('server-status', function(status) {
    callback(status.numberOfGames);
  });
};

exports = module.exports = GameServer;