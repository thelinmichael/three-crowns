var mongoose = require("mongoose");
var Schema = require("../schemas/tile-internal-construction");

module.exports = mongoose.model('InternalConstruction', Schema);