'use strict';

const fs = require('fs');
const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

module.exports = function (grunt) {

  const version = "0.1.1";

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    clean: {
      dist: ['dist/']
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['package.json', '*.md'],
          dest: 'dist/',
          filter: 'isFile'
        }]
      }
    },
    exec: {
      setVersion: {
        cwd: 'dist',
        command: `${npm} version ${version} --no-git-tag-version --allow-same-version`
      },
      createTar: {
        cwd: 'dist',
        command: `${npm} pack`
      }
    },
    babel: {
       options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'dist/index.js': 'src/index.js',
          'dist/aws_xray_mock.js': 'src/aws_xray_mock.js',
          'dist/fulfiller.js': 'src/fulfiller.js',
          'dist/fulfiller_identity_client.js': 'src/fulfiller_identity_client.js',
          'dist/fulfiller_identity_proxy.js': 'src/fulfiller_identity_proxy.js',
          'dist/errors/fulfiller_not_found_error.js': 'src/errors/fulfiller_not_found_error.js',
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

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint', 'mocha_istanbul:coverage', 'istanbul_check_coverage']);

  grunt.registerTask('build', ['clean:dist', 'babel', 'copy']);
  grunt.registerTask('prepublish', ['exec:setVersion', 'exec:createTar']);

};
