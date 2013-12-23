var mongoose = require("mongoose");
var MeepleSchema = require("../schemas/meeple");

module.exports = mongoose.model('Meeple', MeepleSchema);