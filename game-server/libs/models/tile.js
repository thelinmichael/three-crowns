var mongoose = require("mongoose");
var schema = mongoose.Schema({
  components : {
    borders : [Number],
    internal  : Number
  }
});

/* Returns the internal component, e.g. a Cathedral */
schema.methods.getInternal = function() {
  return this.components.internal;
};

/* Returns all 12 borders */
schema.methods.getBorders = function() {
  return this.components.borders;
};

/* Returns the components that make up the northern border (0, 1, 2) */
schema.methods.getNorthernBorder = function() {
  return this.components.borders.slice(0,3);
};

/* Returns the components that make up the eastern border (3, 4, 5) */
schema.methods.getEasternBorder = function() {
  return this.components.borders.slice(3,6);
};

/* Returns the components that make up the southern border (6, 7, 8) */
schema.methods.getSouthernBorder = function() {
  return this.components.borders.slice(6,9);
};

/* Returns the components that make up the western border (9, 10, 11) */
schema.methods.getWesternBorder = function() {
  return this.components.borders.slice(9,12);
};

schema.statics.matchingBorders = function(borders1, borders2) {
  if (!borders1 || !borders2) {
    return false;
  }

  if (borders1.length != borders2.length) {
    return false;
  }

  var bordersMatched = true;
  borders1.forEach(function(border, index) {
    if (border != borders2[index]) {
       bordersMatched = false;
    }
  });

  return bordersMatched;
};

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS  : 0,
  ROAD   : 1,
  CASTLE : 2,
  CATHEDRAL : 3
};