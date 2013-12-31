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


ConnectableSchema.methods.connectsWith = function(area) {
  return this.areaType.sameAs(area.areaType);
}

module.exports = mongoose.model('Connectable', ConnectableSchema);