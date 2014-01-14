var mongoose = require("mongoose");
var Game = require("./models/game");
var Player = require("./models/player");

var GameBuilder = require("./gamebuilder");

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore({ db: 'game' });
var server = express();

var passportSocketIo = require("passport.socketio");

server.use(express.session({
  secret: 'session_secret',
  store: sessionStore
}));

var io;

function GameServer(options) {
  this.running = false;
}

GameServer.prototype.start = function(stopCallback, port, options) {

  this.stopCallback = stopCallback;

  mongoose.connect('mongodb://localhost/game');

  io = require('socket.io').listen(server.listen(port));

  io.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser,
    key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:      'session_secret',    // the session_secret to parse the cookie
    store:       sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));

  this.running = true;

  io.sockets.on('connection', function (socket) {

    socket.emit('connection', { status: 'success' });

    /**
     * create
     */
    socket.on('create', function(options) {
      new GameBuilder().build(function(err, game) {
        if (err) {
          socket.emit('create', { status : 'error', 'message' : err.message });
        } else {
          socket.emit('create', { status : 'success', gameId : game.id });
        }
      });
    });

    /**
     * server-status
     */
    socket.on('server-status', function() {
      var status = {};
      Game.find({}).exec(function(err, games) {
        status.numberOfGames = games.length;
        status.games = games;
        socket.emit('server-status', status);
      });
    });

    /*
     * ping
     */
    socket.on('ping', function() {
      socket.emit('pong', { message : 'pong!'});
    });

    /**
     * find-games
     */
    socket.on('find-games', function() {
      Game.find({}, function(err, foundGames) {
        if (err) {
          socket.emit('find-games', { status : 'error', 'message' : err.message });
        } else {
          socket.emit('find-games', { status : 'success', games : foundGames });
        }
      });
    });

    /**
     * Join game
     */
    socket.on('join', function(options) {
      Game.findById(options.gameId, function(err, game) {
        if (err) {
          socket.emit('join', { status : 'error', 'join' : err.message });
        } else {
          var player = new Player(options.player);
          game.addPlayer(player);
          game.save(function(err, game) {
            if (err) {
              socket.emit('join', { status : 'error', 'join' : err.message });
            } else {
              socket.emit('join', { status : 'success', players : game.players });
            }
          });
        }
      });
    });


    /* Leave game */
    socket.on('leave', function(options) {

    });

  });
};

/**
 * Stop the game server
 */
GameServer.prototype.stop = function() {
  var self = this;
  if (io) {
    mongoose.disconnect();
    io.server.close(function() {
      self.running = false;
      if (this.stopCallback) {
        this.stopCallback();
      }
    });
  }
};

/**
 * Check if the server is running
 * @returns {Boolean} Returns true if the server is running, otherwise false
 */
GameServer.prototype.isRunning = function() {
  return this.running;
};

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);

  // We use this callback to log all of our failed connections.
  accept(null, false);
}

exports = module.exports = GameServer;