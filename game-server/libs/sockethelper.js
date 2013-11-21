function GameHelper(socket) {
  this.socket = socket;
}

GameHelper.prototype.ping = function(callback) {
  this.socket.emit('ping');
  this.socket.on('pong', function(pong) {
    callback(pong);
  });
};

exports = module.exports = GameHelper;