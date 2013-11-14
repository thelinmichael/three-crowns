module.exports = function(grunt) {

  // Load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      coverage: {
        cmd: function() {
          return 'istanbul cover --dir ./reports _mocha -- -R spec test --recursive';
        }
      },
      test: {
        cmd: function() {
          return 'mocha test/ --recursive';
        }
      },
      webserver: {
        cmd: function() {
          return 'node libs/app.js';
        }
      }
    }
  });

  grunt.registerTask('start', ['exec:webserver'])
  grunt.registerTask('coverage', ['exec:coverage']);
  grunt.registerTask('test', ['exec:test']);
};