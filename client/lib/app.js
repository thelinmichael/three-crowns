var express = require('express');
var path = require('path');
var app = express();

var pageDirectory = path.resolve("../pages");

app.get('/', function(req, res) {
  console.log(pageDirectory);
  res.sendfile(pageDirectory + "/index.html");
});

app.listen(8080);
console.log('Listening on port 8080');
