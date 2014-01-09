var mongoose = require("mongoose");

var schema = mongoose.Schema({
  name : { type : String },
  color : { type : String }
});

schema.methods.getName = function() {
  return this.name;
};

module.exports = mongoose.model('Player', schema);
module.exports.schema = schema;