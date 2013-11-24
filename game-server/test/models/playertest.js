var mongoose = require("mongoose");
var Game = require("../../libs/models/player");
var should = require("should");

describe('Player', function() {

	before(function(done) {
    mongoose.connect('mongodb://localhost/game', done);
  });

	beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });

});