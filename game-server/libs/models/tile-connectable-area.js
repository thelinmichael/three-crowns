var mongoose = require("mongoose");

var ConnectableSchema = mongoose.Schema({
  positions : [Number],
  areaType : {},
  extras : [],
  meeplePlaceable : { "type" : Boolean, "default" : true },
});

ConnectableSchema.methods.getType = function() {
  return this.areaType;
};

module.exports = mongoose.model('Connectable', ConnectableSchema);