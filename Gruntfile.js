'use strict';

var LIVERELOAD_PORT = 35729;
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) 
{
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig
  ({
    watch: 
    {
      styles: 
      {
        files: ['app/styles/{,*/}*.css'],
        tasks: ['copy:styles']
      },
      resources: 
      {
        files: ['app/resources/{,*/}*.*'],
        tasks: ['copy:resources']
      },
      livereload: 
      {
        options: 
        {
          livereload: LIVERELOAD_PORT
        },
        files: 
        [
          'app/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,app}/scripts/{,*/}*.js',
          'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: 
    {
      options: 
      {
        port: '9000',
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
      },
      livereload: 
      {
        options: 
        {
          base: ''
        }
      },
      test: 
      {
        options: 
        {
          base: ''
        }
      }
    },
    open: 
    {
      server: 
      {
        url: 'http://localhost:9000'
      }
    },
    clean: 
    {
      server: '.tmp'
    },
    jshint: // Required for tests
    {
      options: 
      {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: 
      [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ]
    },
    // Put files not handled in other tasks here
    copy: 
    {
      styles: 
      {
        expand: true,
        cwd: 'app/styles',
        dest: '.tmp/styles/',
        src: '**/*'
      },
      resources: 
      {
        expand: true,
        cwd: 'app/resources',
        dest: '.tmp/resources/',
        src: '{,*/}*.*'
      }
    },
    concurrent: 
    {
      server: 
      [
        'copy:styles',
        'copy:resources'
      ],
      test: 
      [
        'copy:styles',
        'copy:resources'
      ]
    },
    karma: 
    {
      unit: 
      {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('server', function (target) 
  {
    grunt.task.run(
    [
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', 
  [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);
};