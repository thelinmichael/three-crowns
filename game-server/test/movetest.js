var mongoose = require("mongoose");
var Move = require("../models/move");
var sinon = require("sinon");
var should = require("should");

describe('Move', function() {

  before(function(done) {
    if (mongoose.connection.db) {
        return done();
    }
    mongoose.connect('mongodb://localhost/game_test', done);
  });

    beforeEach(function(done){
    mongoose.connection.db.dropDatabase(function(err){
      if (err) return done(err);
      done();
    });
  });

});