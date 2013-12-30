var mongoose = require("mongoose");
var RiverSchema = require("./rivertile").schema;
var River = require("../tile-components/river");
var Grass = require("../../basegame/tile-components/grass");

var Directions = require("../../../models/tile").Directions;

/* This is a starting tile, but other tiles in the river expansion have higher priority and will thus
   be shuffle before it. */
var priority = 2;

/**
 *  The Lake tile, where the River expansion river ends.
 */
var borders = [
  {
    positions : [ 0,1,2,3,5,6,7,8,9,10,11 ],
    type : Grass
  },
  {
    positions : [ 4 ],
    type : River
  }
];

var LakeTile = mongoose.model('LakeTile', RiverSchema);
module.exports = new LakeTile({ "priority" : priority, "name" : "Lake", "borders" : borders });