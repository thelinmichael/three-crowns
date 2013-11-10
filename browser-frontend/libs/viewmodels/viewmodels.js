define(['/vendor/knockout-3.0.0.js'], function(ko) {
  return function appViewModel() {
    this.numberOfGames = ko.observable(0);
  };
});