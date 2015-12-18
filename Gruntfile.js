/*
 * grunt-shot
 * https://github.com/davidbielik/grunt-shot
 *
 * Copyright (c) 2015 David Bielik
 * Licensed under the MIT license.
 */

(function() {
    'use strict';
    /* global module */
    module.exports = function(grunt) {

        // Project configuration.
        grunt.initConfig({
            jshint: {
                all: [
                    'Gruntfile.js',
                    'tasks/*.js',
                    '<%= nodeunit.tests %>'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            },

            // Before generating any new files, remove any previously-created files.
            clean: {
                tests: ['tmp']
            },

            // Configuration to be run (and then tested).
            shot: {
                pageGroup1: {
                    options: {
                        protocol: 'https',
                        host: 'nerdy.com'
                    },
                    files: {
                    'src': ['/code', '/login', '/home', 'bad']
                    }
                }
            },

            // Unit tests.
            nodeunit: {
                tests: ['test/*_test.js']
            }

        });

        // Actually load this plugin's task(s).
        grunt.loadTasks('tasks');

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-nodeunit');

        // Whenever the "test" task is run, first clean the "tmp" dir, then run this
        // plugin's task(s), then test the result.
        grunt.registerTask('test', ['clean', 'shot', 'nodeunit']);

        // By default, lint and run all tests.
        grunt.registerTask('default', ['shot']);

    };
})();