module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
    jshint: {
      all: ['Gruntfile.js', 'libs/*.js']
    },
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
};