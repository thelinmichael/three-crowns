var BaseSchema = require("../../../schemas/base-schemas/meeple.js");
var mongoose = require("mongoose");

/**
 * Anything that a Meeple needs to react to (e.g. The building it's in is completed, etc.) should be here.
 */

var RegularMeeple = mongoose.model('RegularMeeple', BaseSchema);

module.exports = new RegularMeeple();