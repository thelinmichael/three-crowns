var mongoose = require("mongoose");

var InternalSchema = mongoose.Schema({
  areaType : {},
  meeplePlaceable : { "type" : Boolean, "default" : true }
});

module.exports = mongoose.model('Internal', InternalSchema);