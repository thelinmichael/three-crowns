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
        src: ['test/**/*.js', 'test/*.js']
      }
    },
    /* Javascript linting */
    jshint: {
      all: ['Gruntfile.js', 'libs/**/*.js', 'libs/*.js', 'test/**/*.js']
    },
    /* Rerun linting and tests when models or model tests change */
    watch: {
      models: {
        files: ['libs/models/*.js', 'test/**/*.js'],
        tasks: ['lint', 'test']
      },
      server: {
        files: ['libs/*.js', 'test/servertest.js'],
        tasks: ['restart', 'lint', 'test']
      }
    }
  });

  var server;
  var PORT = 8090;

  grunt.registerTask('start', 'Start the server', function() {
    var done = this.async();

    var GameServer = require('./libs/server.js');
    server = new GameServer();
    server.start(done, PORT);
  });

  grunt.registerTask('stop', 'Stop the server', function() {
    if (server && server.isRunning()) {
      server.stop();
    } else {
      grunt.fail.fatal("No server instance has been created.");
    }
  });

  grunt.registerTask('restart', 'Restart the server', function() {
    var done = this.async();
    if (server && server.isRunning()) {
      server.stop(function() {
        server.start(done, PORT);
      });
    } else {
      done();
    }
  });

  grunt.registerTask('coverage', ['exec:coverage']);
  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('lint', ['jshint:all']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('travis', ['lint','test']);
};