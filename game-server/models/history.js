var mongoose = require("mongoose");
var schema = mongoose.Schema({
  moves : ['Move']
});

module.exports = mongoose.model('History', schema);