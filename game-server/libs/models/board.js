var mongoose = require("mongoose");
var BoardSchema = require("../schemas/board");

module.exports = mongoose.model('Board', BoardSchema);