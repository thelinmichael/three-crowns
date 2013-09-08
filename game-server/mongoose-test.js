var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

var kittySchema = mongoose.Schema({
    name: String
});
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  console.log(greeting);
}
var Kitten = mongoose.model('Kitten', kittySchema)

var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

fluffy.save(function(err, fluffy) {
	if (err) {}
	fluffy.speak();
});

Kitten.find(function (err, kittens) {
  if (err) // TODO handle err
  	console.log(err)
  console.log("Kittens!", kittens)
})