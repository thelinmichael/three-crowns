var mongoose = require("mongoose");
var Tile = require("./tile");

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

// TODO: This function needs to be rewritten.
schema.methods.getBordersBetween = function(start, end, rotation) {
  start -= 3*rotation;
  end -= 3*rotation;

  // Special case. See TODO.
  if (start == -3 && end === 0) {
    end = 12;
  }

  return this.components.borders.slice(start, end);
};

/* Returns the components that make up the northern border (0, 1, 2) */
schema.methods.getNorthernBorder = function(rotation) {
  return this.getBordersBetween(0, 3, rotation);
};

/* Returns the components that make up the eastern border (3, 4, 5) */
schema.methods.getEasternBorder = function(rotation) {
  return this.getBordersBetween(3, 6, rotation);
};

/* Returns the components that make up the southern border (6, 7, 8) */
schema.methods.getSouthernBorder = function(rotation) {
  return this.getBordersBetween(6, 9, rotation);
};

/* Returns the components that make up the western border (9, 10, 11) */
schema.methods.getWesternBorder = function(rotation) {
  return this.getBordersBetween(9, 12, rotation);
};

/* Returns true if the tiles have the same components, regardless of rotation */
schema.methods.sameAs = function(otherTile) {
  if (otherTile === undefined) {
    return false;
  }

  /* Compare internal component */
  if (this.getInternal != otherTile.getInternal) {
    return false;
  }

  /* Compare borders in all rotations */
  for (i = 0; i < 4; i++) {
    if (this.matchingBorders(this.getNorthernBorder(0), otherTile.getNorthernBorder(i)) &&
        this.matchingBorders(this.getEasternBorder(0), otherTile.getEasternBorder(i))   &&
        this.matchingBorders(this.getSouthernBorder(0), otherTile.getSouthernBorder(i)) &&
        this.matchingBorders(this.getWesternBorder(0), otherTile.getWesternBorder(i))) {
      return true;
    }
  }
  return false;
};

// TODO: Must be removed. Should use static instead.
schema.methods.matchingBorders = function(borders1, borders2) {
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