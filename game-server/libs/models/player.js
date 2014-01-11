var mongoose = require("mongoose");

var schema = mongoose.Schema({
  name : { type : String },
  color : { type : String }
});

schema.methods.getName = function() {
  return this.name;
};

schema.pre('save', function(next) {
  if (!(typeof this.name == "string"))
    return next(new Error("Name must be a string"));
  else if (this.name.trim().length == 0) {
    return next(new Error("Name cannot be empty"));
  } else {
    next();
  }
});

module.exports = mongoose.model('Player', schema);
module.exports.schema = schema;