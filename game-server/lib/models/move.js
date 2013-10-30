/* This module will describe a move that can be used to save and repeat a game's history. */
var mongoose = require("mongoose");
var schema = mongoose.Schema({
  player : ['Player']
});

module.exports = mongoose.model('Move', schema);