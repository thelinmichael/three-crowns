module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      /* Start webserver */
      webserver: {
        cmd: function() {
          return 'node libs/app.js';
        }
      }
    },
    /* Run JavaScript linting and recompile */
    watch: {
      main: {
        files: [
          'libs/main.js', 'libs/viewmodels/*.js'
        ],
        tasks: ['jshint:all', 'browserify']
      }
    },
    /* Javascript linting */
    jshint: {
      all: ['Gruntfile.js', 'libs/**/*.js', 'libs/*.js'],
      options: {
        ignores: ['libs/bundle.js']
      }
    },
    /* Compile dependencies into a bundle */
    browserify: {
      main: {
        src: ['libs/main.js'],
        dest: 'libs/bundle.js'
      }
    }
  });

  grunt.registerTask('start', ['exec:webserver']);
  grunt.registerTask('dev', ['browserify', 'watch']);
  grunt.registerTask('lint', ['jshint']);
};