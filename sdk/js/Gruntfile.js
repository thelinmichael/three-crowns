module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* Run tests */
    simplemocha: {
      options: {
        globals: ['should'],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: ['test/*.js']
      }
    },
    /* Javascript linting */
    jshint: {
      all: ['Gruntfile.js', 'libs/*.js']
    },
    /* Rerun linting and tests when models or model tests change */
    watch: {
      models: {
        files: ['libs/*.js', 'test/*.js'],
        tasks: ['lint', 'test']
      }
    }
  });

  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('lint', ['jshint:all']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('travis', ['lint','test']);
};