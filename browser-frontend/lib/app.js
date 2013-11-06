var express = require('express');
var path = require('path');
var app = express();

var PORT = 8080;

var pageDirectory = path.resolve("../pages");

app.get('/', function(req, res) {
  res.sendfile(pageDirectory + "/index.html");
});

app.listen(PORT);
console.log('Listening on port ' + PORT);