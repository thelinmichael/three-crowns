/* TODO: This module will save the game's history. When a tile is placed, 
where it was placed, what type of tile it was, and who placed it. */
var mongoose = require("mongoose");
var schema = mongoose.Schema({
  moves : ['Move']
});

module.exports = mongoose.model('History', schema);