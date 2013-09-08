var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var tileSchema = mongoose.Schema({
    humanReadableName: String,
    startTile : Boolean
});
var Tile = mongoose.model('Tile', tileSchema);

var tile1 = new Tile({ humanReadableName : "River", startTile : true });
var tile2 = new Tile({ humanReadableName : "Cathedral surrounded by grass", startTile : false });

tile1.save(function(err, fluffy) {
	if (err) {}
	console.log("Tile saved.")
});

Tile.find(function (err, tiles) {
  if (err) // TODO handle err
  	console.log(err)
  console.log("Tiles!", tiles)
})