module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      /* Generate test coverage */
      coverage: {
        cmd: function() {
          return 'istanbul cover --dir ./reports _mocha -- -R spec test --recursive';
        }
      },
      /* Run Mocha tests */
      test: {
        cmd: function() {
          return 'mocha test/ --recursive';
        }
      },
      /* Start the Express webserver  */
      webserver: {
        cmd: function() {
          return 'node libs/app.js';
        }
      }
    },
    /* Javascript linting */
    jshint: {
      all: ['Gruntfile.js', 'libs/**/*.js', 'libs/*.js', 'test/**/*.js']
    },
    /* Rerun linting and tests when models or model tests change */
    watch: {
      models: {
        files: [
          'libs/models/*.js', 'test/models/*.js'
        ],
        tasks: ['lint', 'test']
      }
    }
  });

  grunt.registerTask('start', ['exec:webserver']);
  grunt.registerTask('coverage', ['exec:coverage']);
  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('lint', ['jshint:all']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('travis', ['lint','test']);
};