var express = require('express');
var path = require('path');
var app = express();

var PORT = 8080;

var root = path.resolve("../")

app.get('/', function(req, res) {
  res.sendfile(root + "/pages/index.html");
});

app.use('/vendor', express.static(root + '/vendor/'));
app.use('/lib', express.static(root + '/lib/'));

app.listen(PORT);
console.log('Listening on port ' + PORT);