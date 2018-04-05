'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    babel: {
       options: {
         sourceMap: true,
         presets: ['env']
       },
       lib: {
         files: [{
           expand: true,
           cwd: 'src/',
           src: ['*.js'],
           dest: 'lib/',
         }],
      }
    },
    mocha_istanbul: {
      coverage: {
        src: ['unit_tests', 'src'],
        options: {
          mask: '**/*.js'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*',
          check: {
            lines: 70,
            statements: 70
          }
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'unit_test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        ignores: ['src/node_modules/**'],
        esversion: 6,
        node: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint', 'mocha_istanbul:coverage', 'istanbul_check_coverage']);

  grunt.registerTask('build', ['jshint', 'babel']);
};
