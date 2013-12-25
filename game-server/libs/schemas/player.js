var mongoose = require("mongoose");

var schema = mongoose.Schema({
  name : { type : String }
});

schema.methods.getName = function() {
  return this.name;
};

module.exports = schema;