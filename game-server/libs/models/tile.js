var mongoose = require("mongoose");
var Tile = require("./tile");

var schema = mongoose.Schema({
  components : {
    borders : [Number],
    internal : Number
  },
  connections: []
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

schema.methods.setBordersBetween = function(start, end, borderComponents) {
  borderComponents.reverse();
  for (var i = start; i < end; i++) {
    this.components.borders[i] = borderComponents.pop();
  }
};

schema.methods.setNorthernBorder = function(borderComponents) {
  this.setBordersBetween(0, 3, borderComponents);
};

schema.methods.setEasternBorder = function(borderComponents) {
  this.setBordersBetween(3, 6, borderComponents);
};

schema.methods.setSouthernBorder = function(borderComponents) {
  this.setBordersBetween(6, 9, borderComponents);
};

schema.methods.setWesternBorder = function(borderComponents) {
  this.setBordersBetween(9, 12, borderComponents);
};

// Returns true if the tiles have the same components, regardless of rotation
// TODO: Doesn't look at internal component or connections.
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

// TODO: Every tile should its own border matching algorithm, unless using a generic one.
// The parameters should be the other tiles, and which sides that should be compared.
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

schema.methods.rotate = function(rotation) {
  var newNorthernBorder = this.getNorthernBorder(rotation);
  var newEasternBorder = this.getEasternBorder(rotation);
  var newSouthernBorder = this.getSouthernBorder(rotation);
  var newWesternBorder = this.getWesternBorder(rotation);

  this.setNorthernBorder(newNorthernBorder);
  this.setEasternBorder(newEasternBorder);
  this.setSouthernBorder(newSouthernBorder);
  this.setWesternBorder(newWesternBorder);
};

// TODO: Remove.
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

schema.methods.getMeeplePlacements = function() {
  return this.connections;
};

module.exports = mongoose.model('Tile', schema);

module.exports.EdgeTypes = {
  GRASS  : 0,
  ROAD   : 1,
  CASTLE : 2,
  CATHEDRAL : 3
};