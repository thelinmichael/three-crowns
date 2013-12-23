var mongoose = require("mongoose");
var Schema = require("../schemas/tile-border-construction");

module.exports = mongoose.model('BorderConstruction', Schema);