var mongoose = require("mongoose");
var Game = require("../models/player");
var should = require("should");

describe('Player', function() {

	before(function(done) {
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

	beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

});