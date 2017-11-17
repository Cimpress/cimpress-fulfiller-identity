'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    babel: {
       options: {
         sourceMap: true,
         presets: ['env']
       },
       lib: {
        files: {
          'lib/index.js': 'src/index.js',
          'lib/aws_xray_mock.js': 'src/aws_xray_mock.js',
          'lib/fulfiller.js': 'src/fulfiller.js',
          'lib/fulfiller_identity_client.js': 'src/fulfiller_identity_client.js',
          'lib/fulfiller_identity_proxy.js': 'src/fulfiller_identity_proxy.js',
          'lib/errors/fulfiller_not_found_error.js': 'src/errors/fulfiller_not_found_error.js',
        }
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
