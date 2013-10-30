var mongoose = require("mongoose");
var History = require("../../lib/models/history");
var sinon = require("sinon");
var should = require("should");

describe('History', function() {

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

  it("should be able to add a move to history");

});