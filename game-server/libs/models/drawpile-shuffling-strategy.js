var mongoose = require("mongoose");
var DrawpileShufflingStrategy = require("../schemas/drawpile-shuffling-strategy");

module.exports = mongoose.model('DrawpileShufflingStrategy', DrawpileShufflingStrategy);