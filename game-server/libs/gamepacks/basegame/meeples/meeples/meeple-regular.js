var BaseSchema = require("../../../../schemas/meeple.js");
var mongoose = require("mongoose");

/**
 * TODO: This meeple needs to react on some stuff. The functions describing these reactions goes here.
 */

module.exports = mongoose.model('RegularMeeple', BaseSchema);