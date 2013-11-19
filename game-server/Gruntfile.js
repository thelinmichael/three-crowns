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
      }
    },
    /* Run tests */
    simplemocha: {
      options: {
        globals: ['should'],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: ['test/models/*.js', 'test/*.js']
      }
    },
    /* Javascript linting */
    jshint: {
      all: ['Gruntfile.js', 'libs/**/*.js', 'libs/*.js', 'test/**/*.js']
    },
    /* Rerun linting and tests when models or model tests change */
    watch: {
      models: {
        files: ['libs/server.js', 'libs/models/*.js', 'test/models/*.js', 'test/*.js'],
        tasks: ['lint', 'test']
      }
    }
  });

  grunt.registerTask('start', 'Start the server', function() {
    var done = this.async();

    var GameServer = require('./libs/server.js');
    var server = new GameServer();
    server.start(done, 8090);
  });

  grunt.registerTask('coverage', ['exec:coverage']);
  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('lint', ['jshint:all']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('travis', ['lint','test']);
};