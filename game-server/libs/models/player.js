var mongoose = require("mongoose");
var PlayerSchema = require("../schemas/player");

module.exports = mongoose.model('Player', PlayerSchema);