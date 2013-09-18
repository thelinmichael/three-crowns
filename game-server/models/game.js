var mongoose = require("mongoose");
var schema = mongoose.Schema({
  start: Date,
  end : Date,
  test : String
});

schema.methods.startGame = function() {
	this.start = Date.now();
};

schema.methods.endGame = function() {
	this.end = Date.now();
}

schema.methods.isEnded = function() {
	return (this.end != undefined);
}

schema.methods.isStarted = function() {
	return (this.start != undefined);
};

schema.methods.inProgress = function() {
	return (this.isStarted() && !this.isEnded());
}


module.exports = mongoose.model('Game', schema);