var mongoose = require("mongoose");
var schema = mongoose.Schema({
  player : ['Player']
});

module.exports = mongoose.model('Move', schema);