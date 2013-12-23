var RegularMeeple = require("./meeples/meeple-regular");

/* Basepack meeple start settings */
var REGULAR_MEEPLES = 6;

var Meeples = {

  /**
   *  @returns {Array} Returns an array of {Meeple} that represents the meeples that a player starts with.
   */
  getMeeples : function() {
    var returnedMeeples = [];

    for (var i = 0; i < REGULAR_MEEPLES; i++) {
      returnedMeeples.push(new RegularMeeple({ strength : 1 }));
    }

    return returnedMeeples;
  }

};

module.exports = Meeples;