module.exports = function(grunt) {

  // Load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      browserify: {
        cmd: function() {
          return 'browserify libs/main.js -o libs/bundle.js';
        }
      }, webserver: {
        cmd: function() {
          return 'node libs/app.js';
        }
      }
    },
    watch: {
      tests: {
        files: [
          'libs/*.js', 'libs/viewmodels/*.js'
        ],
        tasks: 'exec:browserify'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'libs/**/*.js', 'libs/*.js'],
      options: {
        ignores: ['libs/bundle.js']
      }
    }
  });

  grunt.registerTask('start', ['exec:webserver']);
  grunt.registerTask('dev', ['watch', 'exec:browserify']);
  grunt.registerTask('browserify', ['exec:browserify']);
  grunt.registerTask('lint', ['jshint:all']);
};
